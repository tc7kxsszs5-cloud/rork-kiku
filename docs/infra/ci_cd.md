# CI/CD Configuration для Rork-Kiku

## Обзор

Данный документ описывает CI/CD pipelines для автоматизации build, test, deployment процессов Rork-Kiku.

**Инструменты:**
- **GitHub Actions** — primary CI/CD platform
- **Fastlane** — iOS deployment automation
- **Docker** — containerization для backend
- **Kubernetes** — orchestration
- **Helm** — Kubernetes package manager
- **Terraform** — infrastructure as code (optional, для advanced scenarios)

---

## 1. GitHub Actions Overview

### 1.1 Workflows Structure

```
.github/workflows/
├── backend-ci.yml          # Backend linting, testing
├── backend-deploy.yml      # Backend deployment to Kubernetes
├── ios-ci.yml              # iOS linting, testing
├── ios-beta.yml            # iOS TestFlight deployment
├── android-ci.yml          # Android linting, testing (future)
├── android-beta.yml        # Android beta deployment (future)
└── security-scan.yml       # Security scanning
```

### 1.2 Trigger Strategies

**Push to branches:**
- `main` → run all CI + deploy to staging
- `develop` → run all CI only
- `feature/*` → run relevant CI (backend or mobile)

**Pull Requests:**
- Run CI для affected components
- Required checks перед merge

**Manual (workflow_dispatch):**
- Production deployments
- TestFlight uploads (если не автоматические)

**Scheduled:**
- Nightly builds и tests
- Security scans (weekly)

---

## 2. Backend CI/CD

### 2.1 Backend CI Workflow

**Файл: `.github/workflows/backend-ci.yml`**

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    paths:
      - 'backend/**'

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
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Run ESLint
        working-directory: backend
        run: npm run lint
      
      - name: Run TypeScript check
        working-directory: backend
        run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: rork_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Run unit tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/rork_test
          REDIS_URL: redis://localhost:6379
        run: npm run test:unit
      
      - name: Run integration tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/rork_test
          REDIS_URL: redis://localhost:6379
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
          flags: backend

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Build
        working-directory: backend
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: backend-dist
          path: backend/dist
```

### 2.2 Backend Deployment Workflow

**Файл: `.github/workflows/backend-deploy.yml`**

```yaml
name: Backend Deploy

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: backend
          push: true
          tags: |
            ${{ secrets.DOCKER_REGISTRY }}/rork-backend:${{ github.sha }}
            ${{ secrets.DOCKER_REGISTRY }}/rork-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Output image digest
        run: echo ${{ steps.docker_build.outputs.digest }}

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.event.inputs.environment == 'staging'
    environment: staging
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.28.0'
      
      - name: Setup kubeconfig
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG_STAGING }}
        run: |
          mkdir -p $HOME/.kube
          echo "$KUBE_CONFIG" | base64 -d > $HOME/.kube/config
      
      - name: Deploy with Helm
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          helm upgrade --install rork-backend ./helm/rork-backend \
            --namespace staging \
            --create-namespace \
            --set image.tag=$IMAGE_TAG \
            --set environment=staging \
            --values ./helm/rork-backend/values-staging.yaml \
            --wait --timeout 5m
      
      - name: Verify deployment
        run: |
          kubectl rollout status deployment/rork-backend -n staging --timeout=5m
      
      - name: Run smoke tests
        run: |
          # Placeholder for smoke tests
          echo "Running smoke tests..."
          # curl -f https://staging-api.rorkkiku.com/health || exit 1

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.event.inputs.environment == 'production'
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.28.0'
      
      - name: Setup kubeconfig
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG_PRODUCTION }}
        run: |
          mkdir -p $HOME/.kube
          echo "$KUBE_CONFIG" | base64 -d > $HOME/.kube/config
      
      - name: Deploy with Helm (Canary)
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          # Canary deployment: 10% traffic to new version
          helm upgrade --install rork-backend ./helm/rork-backend \
            --namespace production \
            --create-namespace \
            --set image.tag=$IMAGE_TAG \
            --set environment=production \
            --set canary.enabled=true \
            --set canary.weight=10 \
            --values ./helm/rork-backend/values-production.yaml \
            --wait --timeout 5m
      
      - name: Wait for canary validation
        run: |
          echo "Canary deployed, waiting 5 minutes for validation..."
          sleep 300
      
      - name: Check canary metrics
        run: |
          # Placeholder: проверка метрик (error rate, latency)
          echo "Checking canary metrics..."
          # Если метрики плохие: rollback
      
      - name: Promote canary to full deployment
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          helm upgrade --install rork-backend ./helm/rork-backend \
            --namespace production \
            --set image.tag=$IMAGE_TAG \
            --set environment=production \
            --set canary.enabled=false \
            --values ./helm/rork-backend/values-production.yaml \
            --wait --timeout 10m
      
      - name: Verify deployment
        run: |
          kubectl rollout status deployment/rork-backend -n production --timeout=10m
      
      - name: Run smoke tests
        run: |
          echo "Running production smoke tests..."
          # curl -f https://api.rorkkiku.com/health || exit 1
      
      - name: Notify team
        if: always()
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        run: |
          # Отправка уведомления в Slack
          echo "Deployment completed"
```

### 2.3 Docker Configuration

**Файл: `backend/Dockerfile`**

```dockerfile
# Placeholder Dockerfile для backend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Non-root user для security
RUN addgroup -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nodejs
USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### 2.4 Helm Chart Structure

```
helm/rork-backend/
├── Chart.yaml
├── values.yaml
├── values-staging.yaml
├── values-production.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    ├── secret.yaml
    └── hpa.yaml (horizontal pod autoscaler)
```

**Пример values.yaml:**

```yaml
# Placeholder Helm values
replicaCount: 2

image:
  repository: [DOCKER_REGISTRY]/rork-backend
  pullPolicy: IfNotPresent
  tag: latest

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: api.rorkkiku.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: api-tls
      hosts:
        - api.rorkkiku.com

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 250m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  - name: NODE_ENV
    value: production
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: rork-secrets
        key: database-url
  - name: REDIS_URL
    valueFrom:
      secretKeyRef:
        name: rork-secrets
        key: redis-url

# Livenessно и readiness probes
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
  initialDelaySeconds: 10
  periodSeconds: 5
```

---

## 3. iOS CI/CD

### 3.1 iOS CI Workflow

**Файл: `.github/workflows/ios-ci.yml`**

```yaml
name: iOS CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'ios/**'
      - '.github/workflows/ios-ci.yml'
  pull_request:
    paths:
      - 'ios/**'

jobs:
  lint:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '15.0'
      
      - name: Run SwiftLint
        run: |
          cd ios
          swiftlint lint --reporter github-actions-logging

  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '15.0'
      
      - name: Install dependencies
        run: |
          cd ios
          pod install || echo "No Podfile found"
      
      - name: Run tests
        run: |
          cd ios
          xcodebuild test \
            -workspace RorkKiku.xcworkspace \
            -scheme RorkKiku \
            -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0' \
            -enableCodeCoverage YES \
            | xcpretty --report junit --output test-results.xml
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: ios/test-results.xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ios/coverage.xml
          flags: ios

  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '15.0'
      
      - name: Install dependencies
        run: |
          cd ios
          pod install || echo "No Podfile found"
      
      - name: Build app
        run: |
          cd ios
          xcodebuild \
            -workspace RorkKiku.xcworkspace \
            -scheme RorkKiku \
            -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0' \
            clean build \
            | xcpretty
```

### 3.2 iOS TestFlight Deployment

**См. полную конфигурацию в `docs/apple/testflight_instructions.md`**

**Краткая версия `.github/workflows/ios-beta.yml`:**

```yaml
name: iOS Beta Deployment

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
      
      - name: Install Fastlane
        run: gem install fastlane
      
      - name: Setup certificates (placeholder)
        env:
          CERTIFICATES_P12: ${{ secrets.CERTIFICATES_P12_BASE64 }}
          P12_PASSWORD: ${{ secrets.P12_PASSWORD }}
          PROVISIONING_PROFILE: ${{ secrets.PROVISIONING_PROFILE_BASE64 }}
        run: |
          echo "Setup certificates here"
          # См. полную версию в testflight_instructions.md
      
      - name: Build and upload to TestFlight
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
        run: |
          cd ios
          fastlane beta
```

---

## 4. Security Scanning

### 4.1 Security Scan Workflow

**Файл: `.github/workflows/security-scan.yml`**

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit (backend)
        working-directory: backend
        run: npm audit --audit-level=moderate
        continue-on-error: true
      
      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
        continue-on-error: true

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
```

---

## 5. Secret Management

### 5.1 Required GitHub Secrets

**Repository Secrets (Settings → Secrets → Actions):**

**Backend:**
- `DOCKER_REGISTRY` — container registry URL (e.g., ghcr.io)
- `DOCKER_USERNAME` — registry username
- `DOCKER_PASSWORD` — registry password/token
- `KUBE_CONFIG_STAGING` — base64-encoded kubeconfig для staging
- `KUBE_CONFIG_PRODUCTION` — base64-encoded kubeconfig для production
- `SLACK_WEBHOOK` — Slack webhook для notifications

**iOS:**
- `APPLE_ID` — Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD` — App-Specific Password
- `CERTIFICATES_P12_BASE64` — base64-encoded certificate
- `P12_PASSWORD` — password для certificate
- `PROVISIONING_PROFILE_BASE64` — base64-encoded provisioning profile
- `MATCH_PASSWORD` — password для Fastlane Match (если используете)
- `MATCH_GIT_URL` — URL git repo для Match

**Security:**
- `SNYK_TOKEN` — Snyk API token для dependency scanning

**External Services:**
- `AWS_ACCESS_KEY_ID` — AWS credentials (если используете)
- `AWS_SECRET_ACCESS_KEY`
- `OPENAI_API_KEY` — OpenAI API key (для ML moderation)

### 5.2 Secret Rotation

**Best practices:**
- Rotate secrets quarterly
- Use short-lived tokens где возможно
- Monitor secret usage (GitHub Actions logs)
- Revoke compromised secrets немедленно

### 5.3 Alternative: HashiCorp Vault

**Для enterprise-level secret management:**

```yaml
# Placeholder: пример использования Vault в workflow
- name: Import Secrets from Vault
  uses: hashicorp/vault-action@v2
  with:
    url: ${{ secrets.VAULT_ADDR }}
    token: ${{ secrets.VAULT_TOKEN }}
    secrets: |
      secret/data/rork/database-url database_url | DATABASE_URL;
      secret/data/rork/redis-url redis_url | REDIS_URL
```

**Benefits:**
- Centralized secret management
- Audit logging
- Dynamic secrets (short-lived)
- Fine-grained access control

---

## 6. Terraform (Infrastructure as Code)

### 6.1 Terraform Setup (опционально для advanced scenarios)

**Структура:**

```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── providers.tf
└── modules/
    ├── eks/           # Kubernetes cluster
    ├── rds/           # PostgreSQL database
    ├── elasticache/   # Redis
    └── s3/            # Storage
```

**Пример `main.tf` (placeholder):**

```hcl
# Placeholder Terraform configuration
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket = "rork-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

module "eks" {
  source = "./modules/eks"
  
  cluster_name    = "rork-production"
  cluster_version = "1.28"
  vpc_id          = var.vpc_id
  subnet_ids      = var.subnet_ids
}

module "rds" {
  source = "./modules/rds"
  
  identifier     = "rork-db"
  engine         = "postgres"
  engine_version = "15"
  instance_class = "db.t3.medium"
  
  database_name = "rork"
  username      = var.db_username
  password      = var.db_password
}
```

**GitHub Actions workflow для Terraform:**

```yaml
name: Terraform Apply

on:
  push:
    branches: [main]
    paths:
      - 'terraform/**'
  workflow_dispatch:

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform Init
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          cd terraform
          terraform init
      
      - name: Terraform Plan
        run: |
          cd terraform
          terraform plan -out=tfplan
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: |
          cd terraform
          terraform apply -auto-approve tfplan
```

---

## 7. Monitoring & Alerts Integration

### 7.1 Datadog / New Relic Integration

**В GitHub Actions:**

```yaml
- name: Send deployment event to Datadog
  env:
    DD_API_KEY: ${{ secrets.DATADOG_API_KEY }}
  run: |
    curl -X POST "https://api.datadoghq.com/api/v1/events" \
      -H "DD-API-KEY: ${DD_API_KEY}" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Deployment to Production",
        "text": "Backend deployed: ${{ github.sha }}",
        "tags": ["environment:production", "service:backend"]
      }'
```

### 7.2 Slack Notifications

```yaml
- name: Notify Slack on Success
  if: success()
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
  run: |
    curl -X POST $SLACK_WEBHOOK \
      -H 'Content-Type: application/json' \
      -d '{
        "text": "✅ Deployment succeeded: ${{ github.repository }} @ ${{ github.sha }}",
        "username": "GitHub Actions",
        "icon_emoji": ":rocket:"
      }'

- name: Notify Slack on Failure
  if: failure()
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
  run: |
    curl -X POST $SLACK_WEBHOOK \
      -H 'Content-Type: application/json' \
      -d '{
        "text": "❌ Deployment failed: ${{ github.repository }} @ ${{ github.sha }}",
        "username": "GitHub Actions",
        "icon_emoji": ":x:"
      }'
```

---

## 8. Best Practices

### 8.1 Workflow Organization

**Separate workflows для:**
- CI (lint, test) — run часто, быстро fail
- Deployment — run реже, более тщательно
- Security — scheduled или on-demand
- Release — manual trigger

### 8.2 Caching

**Используйте caching для ускорения workflows:**

```yaml
- name: Cache npm dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-

- name: Cache Docker layers
  uses: actions/cache@v3
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
```

### 8.3 Fail Fast

**Run быстрые checks первыми:**
- Lint → Test → Build
- Если lint fails, не run tests

**Matrix strategies для parallel execution:**

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, macos-latest]
```

### 8.4 Security

**Never log secrets:**
```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: |
    # DON'T: echo "API Key: $API_KEY"
    # DO: echo "Deploying..."
```

**Use OIDC для AWS authentication (no long-lived credentials):**

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
    aws-region: us-east-1
```

---

## 9. Примечания

**Все конфигурации в этом документе — placeholders.**

**Перед использованием в production:**
- Заменить все placeholders реальными значениями
- Настроить secrets в GitHub
- Протестировать workflows на staging environment
- Setup monitoring и alerting
- Документировать runbooks для troubleshooting

**Рекомендации:**
- Start simple: не используйте все сразу
- Iterate: добавляйте функциональность постепенно
- Monitor: отслеживайте workflow execution times и costs
- Optimize: caching, parallel execution

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
