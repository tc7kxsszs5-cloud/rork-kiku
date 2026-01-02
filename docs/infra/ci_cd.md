# CI/CD Pipeline для Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026

---

## Обзор

Этот документ описывает CI/CD (Continuous Integration / Continuous Deployment) pipeline для Rork-Kiku. Мы используем GitHub Actions для автоматизации lint, tests, builds и deployments.

---

## GitHub Actions Pipelines

### Pipeline 1: Lint & Type Check (CI)

**Файл**: `.github/workflows/ci.yml`

```yaml
name: CI - Lint & Type Check

on:
  push:
    branches:
      - main
      - prepare/*
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run ESLint
        run: bun run lint

      - name: Run TypeScript check
        run: bun run ci:tsc

      - name: Check for console.log
        run: |
          if grep -r "console.log" app/ backend/ --exclude-dir=node_modules; then
            echo "❌ console.log найдены! Используйте logger вместо console.log в production коде."
            exit 1
          fi

      - name: Run tests (if available)
        run: bun run test --if-present
        continue-on-error: true
```

**Trigger**:
- Push в `main`, `develop`, `prepare/*`
- Pull requests в `main`, `develop`

**Действия**:
- Проверка кода через ESLint
- TypeScript type checking
- Проверка на наличие `console.log` (опционально)
- Запуск unit tests (если есть)

---

### Pipeline 2: EAS Build (iOS)

**Файл**: `.github/workflows/eas-build-ios.yml`

```yaml
name: EAS Build & Submit (iOS)

on:
  push:
    branches:
      - main
      - release/**
  workflow_dispatch:
    inputs:
      submit_to_testflight:
        description: 'Submit to TestFlight?'
        required: false
        default: 'false'
        type: choice
        options:
          - 'true'
          - 'false'

jobs:
  build:
    runs-on: macos-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Setup Expo & EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build for iOS (Production)
        run: |
          eas build \
            --platform ios \
            --profile production \
            --non-interactive \
            --no-wait

      - name: Submit to TestFlight
        if: github.event.inputs.submit_to_testflight == 'true' || github.ref == 'refs/heads/main'
        run: |
          eas submit \
            --platform ios \
            --profile production \
            --non-interactive
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_SPECIFIC_PASSWORD }}
```

**Trigger**:
- Push в `main` или `release/**`
- Manual workflow dispatch

**Действия**:
- Build iOS приложения через EAS
- Опционально: submit в TestFlight

---

### Pipeline 3: Backend Deploy (Kubernetes)

**Файл**: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend to Kubernetes

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: cd backend && npm install

      - name: Run tests
        run: cd backend && npm run test

      - name: Build Docker image
        run: |
          cd backend
          docker build -t rork-kiku-backend:${{ github.sha }} .

      - name: Push to Container Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag rork-kiku-backend:${{ github.sha }} ${{ secrets.DOCKER_REGISTRY }}/rork-kiku-backend:latest
          docker push ${{ secrets.DOCKER_REGISTRY }}/rork-kiku-backend:latest

      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/backend-deployment.yaml
            k8s/backend-service.yaml
          images: |
            ${{ secrets.DOCKER_REGISTRY }}/rork-kiku-backend:${{ github.sha }}
          kubectl-version: 'latest'
        env:
          KUBECONFIG: ${{ secrets.KUBECONFIG }}

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/backend -n production
```

**Trigger**:
- Push в `main` с изменениями в `backend/**`
- Manual workflow dispatch

**Действия**:
- Build Docker image
- Push в Container Registry (Docker Hub, GCR, ECR)
- Deploy в Kubernetes cluster
- Verify rollout

---

## Fastlane (альтернатива EAS)

Если вы предпочитаете Fastlane для iOS builds:

**Файл**: `fastlane/Fastfile`

```ruby
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "ios/RorkKiku.xcodeproj")
    
    # Build app
    build_app(
      workspace: "ios/RorkKiku.xcworkspace",
      scheme: "RorkKiku",
      export_method: "app-store",
      export_options: {
        provisioningProfiles: {
          "com.rorkkiku.app" => "RorkKiku AppStore"
        }
      }
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      apple_id: ENV["APPLE_ID"]
    )
    
    # Send notification
    slack(
      message: "New iOS build uploaded to TestFlight! 🚀",
      slack_url: ENV["SLACK_WEBHOOK_URL"]
    )
  end

  desc "Run tests"
  lane :test do
    run_tests(
      workspace: "ios/RorkKiku.xcworkspace",
      scheme: "RorkKiku",
      devices: ["iPhone 15 Pro"]
    )
  end
end
```

**GitHub Actions для Fastlane**:

```yaml
name: Fastlane iOS Build

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
      
      - name: Install Fastlane
        run: bundle install
      
      - name: Run Fastlane
        run: bundle exec fastlane beta
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD: ${{ secrets.APPLE_SPECIFIC_PASSWORD }}
```

---

## Terraform для Infrastructure as Code

**Файл**: `terraform/main.tf` (пример для AWS)

```hcl
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket = "rork-kiku-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = "rork-kiku-prod"
  cluster_version = "1.28"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    main = {
      min_size     = 2
      max_size     = 10
      desired_size = 3
      
      instance_types = ["t3.medium"]
    }
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier = "rork-kiku-postgres"
  
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.medium"
  allocated_storage    = 100
  storage_encrypted    = true
  
  db_name  = "rorkkiku"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = 7
  multi_az               = true
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.rds.name
}

# S3 для медиа
resource "aws_s3_bucket" "media" {
  bucket = "rork-kiku-media-prod"
  
  tags = {
    Environment = "production"
  }
}

resource "aws_s3_bucket_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  enabled = true
  
  origin {
    domain_name = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id   = "S3-media"
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-media"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
  }
}
```

**Применение**:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

---

## Kubernetes Manifests

### Backend Deployment

**Файл**: `k8s/backend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: rorkkiku/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
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
---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: production
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**Deploy**:

```bash
kubectl apply -f k8s/backend-deployment.yaml
```

---

## Helm Charts (опционально, для advanced)

**Файл**: `helm/rork-kiku/Chart.yaml`

```yaml
apiVersion: v2
name: rork-kiku
description: Rork-Kiku Backend Helm Chart
version: 1.0.0
appVersion: "1.0"
```

**Файл**: `helm/rork-kiku/values.yaml`

```yaml
replicaCount: 3

image:
  repository: rorkkiku/backend
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: api.rork-kiku.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

**Deploy**:

```bash
helm install rork-kiku ./helm/rork-kiku -n production
```

---

## Secrets Management

### ❌ НЕ делать

- **НЕ** коммитить secrets в Git
- **НЕ** хардкодить API keys в коде
- **НЕ** хранить passwords в plaintext

### ✅ Делать

#### Вариант 1: GitHub Secrets (для CI/CD)

1. GitHub → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Добавить:
   - `EXPO_TOKEN`
   - `APPLE_ID`
   - `APPLE_SPECIFIC_PASSWORD`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `KUBECONFIG`

#### Вариант 2: HashiCorp Vault

```bash
# Установка Vault
helm install vault hashicorp/vault

# Сохранение секрета
vault kv put secret/rork-kiku/database-url url="postgresql://..."

# Чтение секрета
vault kv get secret/rork-kiku/database-url
```

**Интеграция с Kubernetes**:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: backend
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "backend"
    vault.hashicorp.com/agent-inject-secret-database: "secret/rork-kiku/database-url"
spec:
  serviceAccountName: backend
  containers:
  - name: backend
    image: rorkkiku/backend:latest
```

#### Вариант 3: AWS Secrets Manager

```bash
# Создать секрет
aws secretsmanager create-secret \
  --name rork-kiku/database-url \
  --secret-string "postgresql://..."

# Получить секрет
aws secretsmanager get-secret-value \
  --secret-id rork-kiku/database-url
```

**В коде** (Node.js):

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });
const command = new GetSecretValueCommand({ SecretId: "rork-kiku/database-url" });
const data = await client.send(command);
const databaseUrl = data.SecretString;
```

#### Вариант 4: Kubernetes External Secrets Operator

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: backend-secrets
  namespace: production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: backend-secrets
  data:
  - secretKey: database-url
    remoteRef:
      key: rork-kiku/database-url
```

---

## Мониторинг CI/CD

### Slack Notifications

**GitHub Actions**:

```yaml
- name: Notify Slack on success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "✅ Build successful for ${{ github.repository }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "✅ Build *${{ github.run_number }}* successful\n*Branch:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "❌ Build failed for ${{ github.repository }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Email Notifications

GitHub Actions автоматически отправляет email при failure (если включено в настройках).

---

## Best Practices

### 1. Branch Protection

**GitHub → Settings → Branches → Branch protection rules**:

- ✅ Require pull request reviews (минимум 1 approver)
- ✅ Require status checks to pass (CI должен пройти)
- ✅ Require branches to be up to date
- ✅ Restrict who can push to matching branches

### 2. Automated Testing

- Unit tests: каждый commit
- Integration tests: каждый PR
- E2E tests: перед deployment

### 3. Rollback Strategy

**Kubernetes**:

```bash
# Откатить последний deployment
kubectl rollout undo deployment/backend -n production

# Откатить к конкретной revision
kubectl rollout undo deployment/backend --to-revision=2 -n production
```

**EAS/TestFlight**:
- Предыдущие builds остаются в TestFlight
- Можно вернуть старую версию тестерам

### 4. Staging Environment

**Создать staging environment для тестирования перед production**:

```yaml
# k8s/backend-deployment-staging.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-staging
  namespace: staging
spec:
  replicas: 1
  # ... (то же что production, но с меньше ресурсов)
```

**Deploy pipeline**:
1. Push в `develop` → deploy в staging
2. Manual approval → merge в `main` → deploy в production

---

## Дополнительные инструменты

### ArgoCD (GitOps для Kubernetes)

**Установка**:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

**Создание Application**:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: rork-kiku-backend
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/tc7kxsszs5-cloud/rork-kiku
    targetRevision: main
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku DevOps Team

**Полезные ссылки**:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
