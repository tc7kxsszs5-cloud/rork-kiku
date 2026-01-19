# CI/CD Pipeline для Rork-Kiku

## Обзор

Этот документ описывает Continuous Integration и Continuous Deployment (CI/CD) pipeline для Rork-Kiku project используя GitHub Actions.

---

## GitHub Actions Pipeline

### Структура Workflows

```
.github/workflows/
├── ios-build.yml          # iOS app build и тестирование
├── backend-deploy.yml     # Backend deployment к Kubernetes
├── lint-and-test.yml      # Linting и unit tests
├── security-scan.yml      # Security scanning
└── terraform-apply.yml    # Infrastructure changes
```

---

## 1. Lint и Unit Tests Workflow

### `.github/workflows/lint-and-test.yml`

```yaml
name: Lint and Test

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run type-check

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: cd backend && npm ci
      
      - name: Run backend tests
        run: cd backend && npm test
        env:
          DATABASE_URL: postgresql://postgres:test@postgres:5432/test
          REDIS_URL: redis://redis:6379
```

---

## 2. iOS Build Workflow

### `.github/workflows/ios-build.yml`

```yaml
name: iOS Build

on:
  push:
    branches: [ main ]
    paths:
      - 'app/**'
      - 'ios/**'
      - 'package.json'

jobs:
  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup Ruby для Fastlane
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
          bundler-cache: true
      
      - name: Install CocoaPods
        run: cd ios && pod install
      
      # PLACEHOLDER: Требуется Apple Developer credentials
      # Хранить в GitHub Secrets:
      # - APPLE_ID
      # - APP_STORE_CONNECT_API_KEY (JSON)
      # - MATCH_PASSWORD (для fastlane match)
      # - FASTLANE_SESSION
      
      - name: Build iOS App (Release)
        run: |
          cd ios
          bundle exec fastlane build_release
        env:
          FASTLANE_USER: ${{ secrets.APPLE_ID }}
          FASTLANE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
      
      # PLACEHOLDER: Upload к TestFlight (когда credentials available)
      # - name: Upload to TestFlight
      #   run: bundle exec fastlane beta
      #   env:
      #     FASTLANE_USER: ${{ secrets.APPLE_ID }}
      #     APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
```

**Notes:**
- Requires macOS runner (GitHub-hosted или self-hosted)
- Нужны Apple Developer credentials в GitHub Secrets
- Fastlane match для code signing (рекомендуется)
- Альтернатива: использовать Expo EAS Build

---

## 3. Backend Deployment Workflow

### `.github/workflows/backend-deploy.yml`

```yaml
name: Backend Deploy

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'
  workflow_dispatch:  # Manual trigger

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login к Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.REGISTRY_URL }}  # e.g., ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.REGISTRY_URL }}/rork-kiku-backend:${{ github.sha }}
            ${{ secrets.REGISTRY_URL }}/rork-kiku-backend:latest
          cache-from: type=registry,ref=${{ secrets.REGISTRY_URL }}/rork-kiku-backend:buildcache
          cache-to: type=registry,ref=${{ secrets.REGISTRY_URL }}/rork-kiku-backend:buildcache,mode=max

  deploy-to-k8s:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
      
      - name: Configure Kubernetes context
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig.yaml
          export KUBECONFIG=kubeconfig.yaml
      
      - name: Update deployment
        run: |
          kubectl set image deployment/backend-api \
            backend=${{ secrets.REGISTRY_URL }}/rork-kiku-backend:${{ github.sha }} \
            -n production
          
          kubectl rollout status deployment/backend-api -n production
      
      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 4. Terraform Infrastructure Workflow

### `.github/workflows/terraform-apply.yml`

```yaml
name: Terraform Apply

on:
  push:
    branches: [ main ]
    paths:
      - 'terraform/**'
  pull_request:
    paths:
      - 'terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./terraform
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform Init
        run: terraform init
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Terraform Format
        run: terraform fmt -check
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve tfplan
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Terraform Hints:**
- Store state в S3 bucket (remote backend)
- Use workspaces для multiple environments (dev, staging, prod)
- Structure:
  ```
  terraform/
  ├── main.tf              # Main configuration
  ├── variables.tf         # Input variables
  ├── outputs.tf           # Output values
  ├── modules/
  │   ├── vpc/            # VPC module
  │   ├── eks/            # EKS cluster
  │   └── rds/            # Database
  └── environments/
      ├── dev/
      ├── staging/
      └── production/
  ```

---

## 5. Security Scanning Workflow

### `.github/workflows/security-scan.yml`

```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  push:
    branches: [ main ]

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --production
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  
  code-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

---

## Секреты (GitHub Secrets)

### Требуемые Secrets

**Обязательные:**
- `DATABASE_URL` — Connection string для production DB
- `REDIS_URL` — Redis connection
- `JWT_SECRET` — Для signing JWT tokens
- `AWS_ACCESS_KEY_ID` — AWS credentials
- `AWS_SECRET_ACCESS_KEY` — AWS credentials

**Для iOS (когда доступ есть):**
- `APPLE_ID` — Apple Developer account
- `APPLE_PASSWORD` — App-specific password
- `MATCH_PASSWORD` — Fastlane match password
- `APP_STORE_CONNECT_API_KEY` — API key JSON

**Для deployment:**
- `KUBECONFIG` — Kubernetes config (base64 encoded)
- `REGISTRY_URL` — Container registry URL

**Опционально:**
- `SLACK_WEBHOOK` — Для notifications
- `SNYK_TOKEN` — Security scanning
- `SENTRY_DSN` — Error tracking

### Как добавить Secrets

1. GitHub repo → Settings → Secrets and variables → Actions
2. New repository secret
3. Name и Value
4. Add secret

**⚠️ ВАЖНО:** Никогда не commit secrets в код! Всегда использовать GitHub Secrets или другой secrets manager.

---

## Рекомендации по Secrets Management

### Варианты для Production

#### 1. GitHub Secrets (текущий)
- **Pros:** Простой, integrated
- **Cons:** Limited для complex scenarios

#### 2. HashiCorp Vault
- **Pros:** Enterprise-grade, dynamic secrets, audit logs
- **Cons:** Complexity, hosting cost
- **Integration:** 
  ```yaml
  - name: Import Secrets from Vault
    uses: hashicorp/vault-action@v2
    with:
      url: ${{ secrets.VAULT_ADDR }}
      token: ${{ secrets.VAULT_TOKEN }}
      secrets: |
        secret/data/prod/database url | DATABASE_URL ;
        secret/data/prod/jwt secret | JWT_SECRET
  ```

#### 3. AWS Secrets Manager
- **Pros:** Integrated с AWS, automatic rotation
- **Cons:** AWS-specific
- **Integration:**
  ```yaml
  - name: Configure AWS credentials
    uses: aws-actions/configure-aws-credentials@v2
    with:
      aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      aws-region: us-east-1
  
  - name: Get secrets from AWS Secrets Manager
    uses: aws-actions/aws-secretsmanager-get-secrets@v1
    with:
      secret-ids: |
        prod/database
        prod/jwt
  ```

#### 4. Azure Key Vault (если используем Azure)
- Similar integration через Azure actions

---

## Kubernetes Deployment Strategy

### Rolling Update (Default)

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
  namespace: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: backend-api
  template:
    metadata:
      labels:
        app: backend-api
    spec:
      containers:
      - name: backend
        image: ghcr.io/rork-kiku/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Blue-Green Deployment (для critical services)

```yaml
# Deploy "green" версия
kubectl apply -f deployment-green.yaml

# Test green
kubectl port-forward svc/backend-green 8080:80

# Switch traffic (update service selector)
kubectl patch service backend-api -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor
# If issues, rollback:
kubectl patch service backend-api -p '{"spec":{"selector":{"version":"blue"}}}'

# Clean up old blue deployment после success
kubectl delete deployment backend-blue
```

---

## Мониторинг Pipeline

### GitHub Actions Insights
- Actions tab → View workflow runs
- Metrics: success rate, duration, costs

### Notifications
- **Slack:** Integrate через webhook
- **Email:** GitHub can email on failures
- **PagerDuty:** For critical deployments

### Dashboard (Planned)
- Grafana dashboard для deployment metrics
- Track: deploy frequency, lead time, MTTR

---

## Best Practices

### 1. Branch Protection
- Require PR reviews
- Require status checks pass (CI)
- No direct pushes к main

### 2. Environments
- Use GitHub Environments для production
- Require manual approval для prod deploys
- Environment secrets (production vs staging)

### 3. Testing Strategy
- **Unit tests:** Every PR
- **Integration tests:** Before deploy
- **E2E tests:** After staging deploy
- **Smoke tests:** After production deploy

### 4. Rollback Strategy
- Keep previous deployment ready
- Automated rollback on failure signals
- Database migrations: backward compatible

### 5. Security
- Regular dependency updates (Dependabot)
- Scan for secrets (Gitleaks)
- SAST (CodeQL, Snyk)
- Container scanning (Trivy)

---

## Troubleshooting

### Pipeline Failing?

**Check:**
1. Logs в GitHub Actions
2. Dependencies updated? (npm audit)
3. Tests passing locally?
4. Secrets correct?

**Common Issues:**
- **Timeout:** Increase timeout или optimize
- **Secrets missing:** Add в GitHub Secrets
- **Permission denied:** Check IAM roles, RBAC
- **Build fails:** Check Docker cache, dependencies

---

## Future Enhancements

### Planned:
- [ ] Automated E2E testing с Detox/Appium
- [ ] Performance testing (Lighthouse, k6)
- [ ] Multi-region deployments
- [ ] Feature flags integration (LaunchDarkly)
- [ ] Automated rollback on error spike
- [ ] Cost optimization reports

---

**Последнее обновление:** [DATE] — PLACEHOLDER  
**Maintainer:** DevOps Team — [FOUNDERS_EMAIL]
