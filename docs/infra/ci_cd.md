# CI/CD Pipeline для kiku

## Обзор

Автоматизированный pipeline для сборки, тестирования и деплоя приложения kiku. Фокус на безопасности, качестве кода и быстром feedback loop для разработчиков.

## Инструменты

**CI/CD Platform:** GitHub Actions
**Build Service:** Expo Application Services (EAS)
**Infrastructure:** Terraform + Kubernetes
**Secrets Management:** GitHub Secrets + HashiCorp Vault (production)

## Pipeline Stages

### 1. Lint & Code Quality

**Trigger:** На каждый push и pull request

**Файл:** `.github/workflows/ci.yml`

```yaml
name: CI - Lint & Test

on:
  push:
    branches: [main, develop, 'feature/**']
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    name: Lint and Type Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install --frozen-lockfile
      
      - name: Run ESLint
        run: bun run lint
      
      - name: TypeScript type check
        run: bun run ci:tsc
      
      - name: Run tests (when available)
        run: bun run test
        continue-on-error: true
      
      - name: Upload lint results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: lint-results
          path: |
            eslint-report.json
            type-check-report.json
```

**Проверки:**
- ✅ ESLint (code style, potential bugs)
- ✅ TypeScript type checking
- ✅ Unit tests (Jest/Vitest)
- ✅ Code coverage > 70% (когда тесты добавлены)

### 2. Security Scanning

**Trigger:** На каждый push в main и develop

**Файл:** `.github/workflows/security.yml`

```yaml
name: Security Scan

on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * 1'  # Еженедельно по понедельникам в 2 AM

jobs:
  dependency-scan:
    name: Dependency Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Upload Snyk results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: snyk.sarif

  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: TruffleHog Secrets Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
```

**Важно:** 
- ⚠️ **НЕ** коммитить secrets в код
- ⚠️ Secrets scanning обнаружит случайно закоммиченные ключи
- ⚠️ При обнаружении секрета → немедленно rotate credentials

### 3. iOS Build (TestFlight)

**Trigger:** Manual или при push в main/release/**

**Файл:** `.github/workflows/ios-build.yml`

```yaml
name: EAS Build & Submit (iOS)

on:
  push:
    branches:
      - main
      - 'release/**'
  workflow_dispatch:
    inputs:
      profile:
        description: 'EAS Build Profile'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - development
      submit:
        description: 'Submit to TestFlight'
        required: true
        default: true
        type: boolean

jobs:
  build-ios:
    name: Build iOS App
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: bun install
      
      - name: Build iOS app
        run: eas build --platform ios --profile ${{ inputs.profile || 'production' }} --non-interactive
      
      - name: Submit to TestFlight
        if: ${{ inputs.submit == true }}
        run: eas submit --platform ios --latest --non-interactive
        env:
          # Option 1: App Store Connect API Key (Recommended)
          EXPO_APPLE_API_KEY_PATH: /tmp/apple-api-key.json
          # Option 2: Apple ID (Alternative)
          # EXPO_APPLE_ID: ${{ secrets.APPLE_ID }}
          # EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ios-build-${{ github.sha }}
          path: |
            eas-build-*.ipa
            build-metadata.json
```

**Секреты для iOS Build (GitHub Secrets):**

```bash
# Required
EXPO_TOKEN=<your-expo-access-token>

# Option 1: App Store Connect API Key (Recommended)
APPLE_API_KEY_JSON='{
  "key_id": "YOUR_KEY_ID",
  "issuer_id": "YOUR_ISSUER_ID",
  "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
}'

# Option 2: Apple ID (Alternative)
APPLE_ID=<your-apple-id-email>
APPLE_APP_SPECIFIC_PASSWORD=<app-specific-password>
```

**Как получить секреты:**

1. **EXPO_TOKEN:**
   - Перейти на [expo.dev/accounts/[account]/settings/access-tokens](https://expo.dev)
   - Создать новый Personal Access Token
   - Скопировать и добавить в GitHub Secrets

2. **App Store Connect API Key (Option 1 - РЕКОМЕНДУЕТСЯ):**
   ```bash
   # 1. Создать API key в App Store Connect
   # https://appstoreconnect.apple.com/access/api
   
   # 2. Скачать .p8 файл
   
   # 3. Создать JSON:
   {
     "key_id": "ABC123XYZ",
     "issuer_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "key": "-----BEGIN PRIVATE KEY-----\nMIGTAgE...\n-----END PRIVATE KEY-----"
   }
   
   # 4. Добавить в GitHub Secrets как APPLE_API_KEY_JSON
   ```

3. **Apple ID + App-Specific Password (Option 2):**
   ```bash
   # 1. Apple ID - ваш email от Apple Developer Account
   
   # 2. App-Specific Password:
   #    - Перейти на https://appleid.apple.com
   #    - Security → App-Specific Passwords
   #    - Generate password for "EAS CLI"
   #    - Скопировать и добавить в GitHub Secrets
   ```

### 4. Backend Deploy

**Trigger:** После успешного build при push в main

**Файл:** `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend to Kubernetes

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - 'k8s/**'
  workflow_dispatch:

env:
  AWS_REGION: eu-central-1
  EKS_CLUSTER_NAME: kiku-prod
  ECR_REPOSITORY: kiku-backend

jobs:
  deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Scan Docker image for vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
      
      - name: Push Docker image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name $EKS_CLUSTER_NAME --region $AWS_REGION
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/api-gateway \
            api-gateway=${{ steps.login-ecr.outputs.registry }}/$ECR_REPOSITORY:${{ github.sha }} \
            -n kiku-production
          
          kubectl rollout status deployment/api-gateway -n kiku-production
      
      - name: Run smoke tests
        run: |
          # Wait for deployment
          sleep 30
          
          # Health check
          curl -f https://api.kiku-app.com/health || exit 1
      
      - name: Notify deployment
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Backend deployment ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Backend deployment *${{ job.status }}*\nCommit: ${{ github.sha }}\nAuthor: ${{ github.actor }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Секреты для Backend Deploy:**

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>

# Slack Notifications (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
```

**Важно для безопасности:**
- ✅ Используйте IAM роли с минимальными правами (least privilege)
- ✅ AWS credentials только для CI/CD операций
- ✅ Регулярно rotate AWS keys (каждые 90 дней)
- ✅ Enable CloudTrail для audit logging

### 5. Infrastructure as Code (Terraform)

**Файл:** `.github/workflows/terraform.yml`

```yaml
name: Terraform Infrastructure

on:
  push:
    branches: [main]
    paths:
      - 'terraform/**'
  pull_request:
    branches: [main]
    paths:
      - 'terraform/**'

jobs:
  terraform:
    name: Terraform Plan and Apply
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.0
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1
      
      - name: Terraform Init
        working-directory: ./terraform
        run: terraform init
      
      - name: Terraform Validate
        working-directory: ./terraform
        run: terraform validate
      
      - name: Terraform Plan
        working-directory: ./terraform
        run: terraform plan -out=tfplan
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        working-directory: ./terraform
        run: terraform apply -auto-approve tfplan
```

**Terraform структура (пример):**

```
terraform/
├── main.tf              # Main configuration
├── variables.tf         # Input variables
├── outputs.tf           # Output values
├── backend.tf           # Remote state (S3)
├── modules/
│   ├── vpc/            # VPC module
│   ├── eks/            # EKS cluster
│   ├── rds/            # PostgreSQL database
│   └── s3/             # S3 buckets
└── environments/
    ├── dev/
    ├── staging/
    └── production/
```

**Backend configuration (S3 для state):**

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "kiku-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "kiku-terraform-locks"
  }
}
```

## Безопасное управление секретами

### GitHub Secrets

**Где хранить:**
- Repository Settings → Secrets and variables → Actions

**Типы секретов:**

1. **Environment Secrets** (по среде):
   ```
   development:
     - DEV_DATABASE_URL
     - DEV_API_KEY
   
   production:
     - PROD_DATABASE_URL
     - PROD_API_KEY
   ```

2. **Repository Secrets** (общие):
   ```
   - EXPO_TOKEN
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - SNYK_TOKEN
   ```

**НЕ коммитить в репозиторий:**
```bash
# ❌ НИКОГДА не делать так:
export DATABASE_URL="postgresql://user:password@host/db"

# ✅ Правильно:
export DATABASE_URL="${{ secrets.DATABASE_URL }}"
```

### HashiCorp Vault (Production)

**Для production рекомендуется использовать Vault:**

```yaml
# Example: Retrieving secrets from Vault
- name: Import Secrets from Vault
  uses: hashicorp/vault-action@v2
  with:
    url: https://vault.kiku-app.com
    token: ${{ secrets.VAULT_TOKEN }}
    secrets: |
      secret/data/kiku/prod database_url | DATABASE_URL ;
      secret/data/kiku/prod api_key | API_KEY
```

**Преимущества Vault:**
- ✅ Centralized secrets management
- ✅ Dynamic secrets (auto-rotation)
- ✅ Audit logging
- ✅ Fine-grained access control

### Secrets Rotation Policy

**Schedule:**
```
API Keys:           Каждые 90 дней
Database Passwords: Каждые 30 дней (dynamic с Vault)
AWS Keys:           Каждые 90 дней
TLS Certificates:   Автоматически (Let's Encrypt 90 дней)
JWT Signing Keys:   Каждые 180 дней
```

**Rotation Process:**
```bash
# 1. Generate new secret
NEW_KEY=$(openssl rand -base64 32)

# 2. Update Vault/GitHub Secrets
gh secret set API_KEY --body "$NEW_KEY"

# 3. Deploy with dual-key support (grace period)
# Both old and new keys valid for 24 hours

# 4. Monitor for errors

# 5. Deactivate old key after grace period
```

## Environment-specific Configurations

### Development
```yaml
environment: development
database: Local PostgreSQL or Docker
ai_provider: OpenAI (dev API key with lower rate limit)
logging: Debug level
monitoring: Minimal
```

### Staging
```yaml
environment: staging
database: AWS RDS (small instance)
ai_provider: OpenAI (staging API key)
logging: Info level
monitoring: CloudWatch basic
terraform_workspace: staging
```

### Production
```yaml
environment: production
database: AWS RDS (multi-AZ, replicas)
ai_provider: OpenAI (production API key with high limits)
logging: Warn level + structured JSON
monitoring: Full stack (CloudWatch + Prometheus + Grafana)
backup: Daily automated backups
terraform_workspace: production
```

## Monitoring CI/CD Pipeline

### GitHub Actions Insights

**Metrics to track:**
- Build duration (target: < 10 minutes)
- Success rate (target: > 95%)
- Flaky tests (target: 0)
- Security scan failures

**Dashboard:** GitHub Actions tab → Workflow analytics

### Alerts

**Set up alerts for:**
- ❌ Failed deployments
- ❌ Security vulnerabilities (high/critical)
- ❌ Build time > 15 minutes
- ❌ Test coverage drop > 5%

**Alert channels:**
- Slack #ci-cd-alerts
- Email to engineering team
- PagerDuty (for production failures)

## Rollback Strategy

### Kubernetes Rollback

```bash
# Rollback to previous deployment
kubectl rollout undo deployment/api-gateway -n kiku-production

# Rollback to specific revision
kubectl rollout undo deployment/api-gateway -n kiku-production --to-revision=5

# Check rollout history
kubectl rollout history deployment/api-gateway -n kiku-production
```

### Database Migrations Rollback

```bash
# Always create reversible migrations

# Forward migration
npm run migrate:up

# Rollback migration
npm run migrate:down

# In production, test migrations in staging first!
```

## Best Practices

### 1. Trunk-based Development

```
main ────────────────────────────────
  ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
  │ │ │ │ │ │ │ │
  feature branches (short-lived, < 2 days)
```

**Guidelines:**
- Feature branches live < 2 дня
- Merge to main часто (несколько раз в день)
- CI runs на каждый commit
- Используйте feature flags для незавершенных features

### 2. Automated Testing Strategy

```
Pyramid of Tests:

        /\
       /  \      E2E Tests (5%)
      /────\
     /      \    Integration Tests (15%)
    /────────\
   /          \  Unit Tests (80%)
  /────────────\
```

**Test Coverage Goals:**
- Unit tests: 80%+
- Integration tests: Critical paths
- E2E tests: Happy paths only

### 3. Progressive Deployment

**Deployment strategy for production:**

```
1. Deploy to staging
   ↓
2. Run smoke tests
   ↓
3. Deploy to 10% of production (canary)
   ↓
4. Monitor metrics for 30 minutes
   ↓
5. If OK → Deploy to 50%
   ↓
6. Monitor metrics for 30 minutes
   ↓
7. If OK → Deploy to 100%
```

**Tools:** Flagger (for Kubernetes), AWS CodeDeploy

### 4. Continuous Security

**Security in CI/CD:**
- ✅ Dependency scanning на каждый commit
- ✅ Container scanning перед deploy
- ✅ Secrets scanning автоматически
- ✅ SAST (Static Application Security Testing)
- ✅ DAST (Dynamic Application Security Testing) в staging

## Troubleshooting

### Common Issues

**Issue: EAS Build fails**
```bash
# Check logs
eas build:list --platform ios

# View specific build logs
eas build:view <build-id>

# Common fixes:
# 1. Update eas.json configuration
# 2. Check Apple Developer certificates
# 3. Verify EXPO_TOKEN is valid
```

**Issue: Deployment rollout stuck**
```bash
# Check deployment status
kubectl describe deployment api-gateway -n kiku-production

# Check pod logs
kubectl logs -l app=api-gateway -n kiku-production

# Force rollout (if safe)
kubectl rollout restart deployment/api-gateway -n kiku-production
```

**Issue: Failed to retrieve secrets**
```bash
# Verify GitHub Secrets are set
gh secret list

# Test Vault connection
vault kv get secret/kiku/prod/api_key

# Check IAM permissions for AWS
aws sts get-caller-identity
```

## Next Steps

**После настройки базового CI/CD:**

1. ✅ Добавить E2E tests (Detox для React Native)
2. ✅ Implement canary deployments
3. ✅ Set up Grafana dashboards для pipeline metrics
4. ✅ Add automated performance testing
5. ✅ Implement blue-green deployment для zero-downtime

---

**Документ обновлен:** 2026-01-02
**Версия:** 1.0 (Draft)
**Ответственный:** DevOps/SRE Lead

**Контакты для вопросов:**
- DevOps: devops@kiku-app.com
- CI/CD Issues: Slack #devops-help
