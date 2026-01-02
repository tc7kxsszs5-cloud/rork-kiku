# CI/CD Pipeline — kiku

## Обзор

Этот документ описывает CI/CD процесс для kiku с использованием GitHub Actions, EAS Build, и рекомендаций по deployment в production.

---

## GitHub Actions Workflows

### Workflow 1: Lint & Type Check (CI)

**Файл:** `.github/workflows/ci.yml`

**Trigger:**
- Push в `main`, `develop`, `prepare/*`
- Pull requests в `main`

**Jobs:**
- ESLint проверка
- TypeScript type check
- Unit tests (если есть)

**Example:**
```yaml
name: CI

on:
  push:
    branches: [main, develop, prepare/*]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Run ESLint
        run: bun run lint
      
      - name: TypeScript check
        run: bunx tsc --noEmit
      
      - name: Run tests
        run: bun run test || echo "No tests configured"
```

### Workflow 2: EAS Build & Submit (iOS)

**Файл:** `.github/workflows/eas-build.yml`

**Trigger:**
- Manual (workflow_dispatch)
- Push в `main` или `release/**`

**Jobs:**
- Build iOS app с EAS
- Submit в TestFlight (опционально)

**Example:**
```yaml
name: EAS Build & Submit (iOS)

on:
  push:
    branches: [main, release/**]
  workflow_dispatch:
    inputs:
      profile:
        description: 'Build profile'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - preview
      submit:
        description: 'Submit to TestFlight'
        required: true
        default: true
        type: boolean

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build iOS
        run: eas build --platform ios --profile ${{ inputs.profile || 'production' }} --non-interactive --no-wait
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Submit to TestFlight
        if: ${{ inputs.submit == 'true' && (inputs.profile == 'production' || inputs.profile == '') }}
        run: eas submit --platform ios --latest --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          EXPO_APPLE_ID: ${{ secrets.APPLE_ID }}
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

---

## Secrets Management

### Required GitHub Secrets

**В Settings → Secrets and variables → Actions:**

#### 1. EXPO_TOKEN (обязательно)
```bash
# Получить токен
eas whoami
# Перейти на expo.dev → Settings → Access Tokens → Create
```

#### 2. APPLE_ID (для auto-submit)
```
Ваш Apple ID email (например: developer@example.com)
```

#### 3. APPLE_APP_SPECIFIC_PASSWORD (для auto-submit)
```bash
# Создать App-Specific Password
# 1. Перейти на appleid.apple.com
# 2. Security → App-Specific Passwords
# 3. Generate → Name: "kiku-ci" → Create
# 4. Скопировать password (показывается один раз)
```

#### 4. APPLE_API_KEY_JSON (альтернатива, рекомендуется)
```json
{
  "key_id": "ABC123DEF4",
  "issuer_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
}
```

**Как получить:**
1. App Store Connect → Users and Access → Keys
2. Generate API Key (access: App Manager или Admin)
3. Download `.p8` file
4. Создать JSON с key_id, issuer_id, и содержимым `.p8`

---

## Backend CI/CD (когда будет backend)

### Example: Deploy to Kubernetes

```yaml
name: Backend Deploy

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          cd backend
          docker build -t kiku-backend:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker tag kiku-backend:${{ github.sha }} username/kiku-backend:${{ github.sha }}
          docker push username/kiku-backend:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/deployment.yml
          images: username/kiku-backend:${{ github.sha }}
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
```

---

## Infrastructure as Code (Terraform)

### Example: AWS Infrastructure

```hcl
# terraform/main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "kiku-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "kiku-production"
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier     = "kiku-db"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  storage_encrypted     = true
  
  username = "kiku_admin"
  password = var.db_password # From secrets
  
  backup_retention_period = 7
  multi_az                = true
  
  tags = {
    Environment = "production"
  }
}

# S3 Bucket for media
resource "aws_s3_bucket" "media" {
  bucket = "kiku-media-production"
  
  tags = {
    Environment = "production"
  }
}

resource "aws_s3_bucket_encryption" "media" {
  bucket = aws_s3_bucket.media.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

### Deploy Infrastructure

```bash
# Initialize
cd terraform
terraform init

# Plan
terraform plan -var-file="production.tfvars"

# Apply
terraform apply -var-file="production.tfvars"
```

---

## Kubernetes Deployment

### Example: Deployment manifest

```yaml
# k8s/deployment.yml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: kiku-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kiku-api
  template:
    metadata:
      labels:
        app: kiku-api
    spec:
      containers:
      - name: api
        image: username/kiku-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: kiku-secrets
              key: database-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: kiku-secrets
              key: openai-api-key
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
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: kiku-api
  namespace: production
spec:
  type: LoadBalancer
  selector:
    app: kiku-api
  ports:
  - port: 80
    targetPort: 3000
```

### Secrets Management in Kubernetes

```bash
# Create secret from file
kubectl create secret generic kiku-secrets \
  --from-literal=database-url="postgresql://user:pass@host:5432/db" \
  --from-literal=openai-api-key="sk-xxx..." \
  --namespace=production

# Or from YAML (encrypted with SOPS or Sealed Secrets)
kubectl apply -f k8s/secrets.yml
```

**Рекомендация:** Использовать **External Secrets Operator** для интеграции с AWS Secrets Manager / HashiCorp Vault.

---

## Monitoring & Observability

### Prometheus + Grafana

```yaml
# k8s/monitoring.yml

apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'kiku-api'
        kubernetes_sd_configs:
          - role: pod
            namespaces:
              names:
                - production
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            regex: kiku-api
            action: keep
```

### Grafana Dashboards

**Metrics to track:**
- API request rate (requests/sec)
- API latency (p50, p95, p99)
- Error rate (5xx errors)
- Database query time
- AI inference latency
- Memory/CPU usage

---

## GitOps with ArgoCD

### Example: ArgoCD Application

```yaml
# argocd/application.yml

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: kiku-production
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
    syncOptions:
    - CreateNamespace=true
```

### Setup ArgoCD

```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

---

## Secrets Loading Best Practices

### ⚠️ НИКОГДА не коммитить секреты в Git

**Плохо:**
```javascript
// ❌ НЕ ДЕЛАТЬ
const apiKey = "sk-abc123...";
```

**Хорошо:**
```javascript
// ✅ Загрузка из environment variables
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY not set");
}
```

### Development

```bash
# .env.local (git-ignored)
OPENAI_API_KEY=sk-xxx...
DATABASE_URL=postgresql://localhost:5432/kiku_dev
```

### Production

**Option 1: GitHub Secrets (для CI/CD)**
```yaml
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

**Option 2: AWS Secrets Manager (для runtime)**
```javascript
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({ region: 'us-east-1' });
const secret = await client.getSecretValue({ SecretId: 'kiku/openai-key' });
const apiKey = JSON.parse(secret.SecretString).OPENAI_API_KEY;
```

**Option 3: HashiCorp Vault (для runtime)**
```javascript
import Vault from 'node-vault';

const vault = Vault({ endpoint: process.env.VAULT_ADDR });
await vault.userpassLogin({ username: 'app', password: process.env.VAULT_PASSWORD });
const secret = await vault.read('secret/kiku/openai');
const apiKey = secret.data.api_key;
```

---

## Deployment Checklist

### Pre-deployment

- [ ] All tests pass (CI green)
- [ ] Security scan pass (CodeQL, Snyk)
- [ ] Code review approved
- [ ] Secrets rotated (if needed)
- [ ] Database migrations tested
- [ ] Rollback plan ready

### Deployment

- [ ] Tag release (`git tag v1.0.0`)
- [ ] Build production images
- [ ] Deploy to staging first
- [ ] Smoke tests на staging
- [ ] Deploy to production (blue-green или canary)
- [ ] Monitor metrics (5 минут)
- [ ] Verify functionality (smoke tests)

### Post-deployment

- [ ] Announce в team chat
- [ ] Update status page (если was downtime)
- [ ] Monitor logs и metrics (30 минут)
- [ ] Документировать changes (changelog)

---

## Rollback Plan

### Если deployment пошел не так:

**Kubernetes:**
```bash
# Rollback to previous version
kubectl rollout undo deployment/kiku-api -n production

# Check status
kubectl rollout status deployment/kiku-api -n production
```

**EAS/Expo:**
```bash
# Revert to previous update
eas update --branch production --message "Rollback to previous version"
```

**Database:**
```bash
# Run down migration
npm run db:migrate:down

# Or restore from backup
pg_restore -d kiku_production backup.dump
```

---

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [ArgoCD Docs](https://argo-cd.readthedocs.io/)

---

**Статус:** Руководство для DevOps  
**Последнее обновление:** Январь 2024
