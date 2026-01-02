# CI/CD Pipeline — Rork-Kiku

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT
- **Контакт**: [FOUNDERS_EMAIL]

---

## 1. Обзор CI/CD Strategy

### 1.1. Цели
- Автоматизация testing, building, и deployment
- Быстрая обратная связь для developers
- Безопасное управление secrets
- Reproducible builds
- Zero-downtime deployments

### 1.2. Инструменты
- **CI Platform**: GitHub Actions
- **Build Service**: Expo EAS (для iOS/Android builds)
- **Deployment**: Kubernetes + Helm (backend), EAS Submit (mobile)
- **Infrastructure**: Terraform (IaC)
- **Secret Management**: GitHub Secrets, AWS Secrets Manager, HashiCorp Vault

---

## 2. GitHub Actions Workflows

### 2.1. Lint & Type Check (на каждый PR)

**Файл**: `.github/workflows/ci.yml`

```yaml
name: CI - Lint & Type Check

on:
  push:
    branches: [main, develop, 'prepare/*']
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
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
        run: npm run ci:tsc
      
      - name: Run tests (if any)
        run: npm test || echo "No tests yet"
```

**Triggers**:
- Every push to `main`, `develop`, `prepare/*` branches
- Every pull request

**Duration**: ~2-3 minutes

### 2.2. iOS Build & Submit (TestFlight)

**Файл**: `.github/workflows/eas-build-ios.yml`

```yaml
name: EAS Build & Submit (iOS)

on:
  push:
    branches: [main, 'release/**']
  workflow_dispatch:
    inputs:
      submit_to_testflight:
        description: 'Submit to TestFlight after build?'
        required: false
        default: 'false'

jobs:
  build-ios:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build iOS app (EAS)
        run: eas build --platform ios --profile production --non-interactive
      
      - name: Submit to TestFlight (опционально)
        if: github.event.inputs.submit_to_testflight == 'true' || github.ref == 'refs/heads/main'
        run: eas submit --platform ios --latest --non-interactive
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

**Triggers**:
- Push to `main` или `release/**` branches
- Manual trigger (workflow_dispatch)

**Duration**: ~30-40 minutes (EAS build в cloud)

### 2.3. Android Build (Future)

**Файл**: `.github/workflows/eas-build-android.yml`

```yaml
name: EAS Build & Submit (Android)

on:
  push:
    branches: [main, 'release/**']
  workflow_dispatch:

jobs:
  build-android:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Android app
        run: eas build --platform android --profile production --non-interactive
      
      - name: Submit to Google Play (internal track)
        run: eas submit --platform android --latest --track internal
        env:
          GOOGLE_SERVICE_ACCOUNT_KEY: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}
```

**Status**: Phase 2 (после iOS MVP)

### 2.4. Backend Deploy (Kubernetes)

**Файл**: `.github/workflows/backend-deploy.yml`

```yaml
name: Backend Deploy

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  workflow_dispatch:

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to ECR
        run: |
          aws ecr get-login-password --region us-east-1 | \
          docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
      
      - name: Build Docker image
        run: |
          docker build -t rork-kiku-backend:${{ github.sha }} ./backend
          docker tag rork-kiku-backend:${{ github.sha }} ${{ secrets.ECR_REGISTRY }}/rork-kiku-backend:${{ github.sha }}
          docker tag rork-kiku-backend:${{ github.sha }} ${{ secrets.ECR_REGISTRY }}/rork-kiku-backend:latest
      
      - name: Push Docker image
        run: |
          docker push ${{ secrets.ECR_REGISTRY }}/rork-kiku-backend:${{ github.sha }}
          docker push ${{ secrets.ECR_REGISTRY }}/rork-kiku-backend:latest
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'
      
      - name: Update kubeconfig
        run: aws eks update-kubeconfig --region us-east-1 --name rork-kiku-production
      
      - name: Deploy with Helm
        run: |
          helm upgrade --install rork-kiku-backend ./helm/backend \
            --set image.tag=${{ github.sha }} \
            --set secrets.enabled=true \
            --namespace rork-kiku-production \
            --wait --timeout 5m
```

**Triggers**: Push to `main` (но только если есть изменения в `backend/`)

**Duration**: ~5-10 minutes

---

## 3. Secret Management

### 3.1. GitHub Secrets (обязательные)

В GitHub repository settings добавить:

**Expo/EAS**:
- `EXPO_TOKEN`: Expo access token (https://expo.dev/settings/access-tokens)

**Apple**:
- `APPLE_ID`: Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password
- `APPLE_TEAM_ID`: 10-character Team ID
- `ASC_KEY_ID`: App Store Connect API Key ID (опционально)
- `ASC_ISSUER_ID`: App Store Connect Issuer ID
- `ASC_PRIVATE_KEY`: App Store Connect API private key (.p8 файл, base64)

**Google (Android, фаза 2)**:
- `GOOGLE_SERVICE_ACCOUNT_KEY`: JSON key для Google Play API

**AWS (backend)**:
- `AWS_ACCESS_KEY_ID`: AWS access key для ECR и EKS
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `ECR_REGISTRY`: ECR registry URL (e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com`)

**Database**:
- `DATABASE_URL`: PostgreSQL connection string (для migrations в CI)

### 3.2. AWS Secrets Manager (runtime secrets)

Для production secrets (API keys, database passwords):
- Хранить в AWS Secrets Manager
- Kubernetes pods читают через External Secrets Operator
- Ротация автоматическая (90 days)

**Пример**:
```yaml
# ExternalSecret in Kubernetes
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: rork-kiku-backend-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: backend-secrets
  data:
    - secretKey: DATABASE_URL
      remoteRef:
        key: rork-kiku/production/database
        property: url
    - secretKey: JWT_SECRET
      remoteRef:
        key: rork-kiku/production/jwt
        property: secret
```

### 3.3. ⚠️ НИКОГДА НЕ commit secrets в Git!

**Запрещено**:
- `.env` files с реальными credentials
- API keys в code
- `.p12` certificates
- Private keys

**Используйте**:
- `.env.example` (с placeholder values)
- GitHub Secrets
- AWS Secrets Manager
- HashiCorp Vault (для enterprise)

---

## 4. Infrastructure as Code (Terraform)

### 4.1. Terraform Setup

**Структура**:
```
terraform/
├── main.tf              # Entry point
├── variables.tf         # Input variables
├── outputs.tf           # Output values
├── backend.tf           # S3 backend config
├── modules/
│   ├── eks/            # EKS cluster
│   ├── rds/            # PostgreSQL RDS
│   ├── redis/          # ElastiCache Redis
│   ├── s3/             # S3 buckets
│   └── vpc/            # VPC networking
└── environments/
    ├── dev/
    ├── staging/
    └── production/
```

### 4.2. Пример Terraform (EKS Cluster)

**Файл**: `terraform/modules/eks/main.tf`

```hcl
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  tags = {
    Environment = var.environment
    Project     = "rork-kiku"
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.cluster_name}-nodes"
  node_role_arn   = aws_iam_role.node_group.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }

  instance_types = ["t3.medium"]

  tags = {
    Environment = var.environment
  }
}
```

### 4.3. Terraform Workflow

```bash
# Initialize
cd terraform/environments/production
terraform init

# Plan changes
terraform plan -out=tfplan

# Apply changes (после review)
terraform apply tfplan

# Управление state
terraform state list
terraform state show aws_eks_cluster.main
```

**State хранение**: S3 bucket с versioning + DynamoDB для locking

---

## 5. Kubernetes Deployment

### 5.1. Helm Chart Structure

```
helm/
├── backend/
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── values-production.yaml
│   ├── values-staging.yaml
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       ├── configmap.yaml
│       ├── secret.yaml (если не используем External Secrets)
│       └── hpa.yaml
└── ml-worker/
    └── ... (similar structure)
```

### 5.2. Пример Deployment (backend)

**Файл**: `helm/backend/templates/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "backend.fullname" . }}
  labels:
    {{- include "backend.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "backend.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "backend.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: backend
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 3000
              protocol: TCP
          env:
            - name: NODE_ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: backend-secrets
                  key: DATABASE_URL
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: backend-secrets
                  key: REDIS_URL
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
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

### 5.3. Helm Deployment

```bash
# Install или upgrade
helm upgrade --install rork-kiku-backend ./helm/backend \
  -f ./helm/backend/values-production.yaml \
  --set image.tag=$COMMIT_SHA \
  --namespace rork-kiku-production \
  --create-namespace \
  --wait --timeout 5m

# Rollback (если что-то пошло не так)
helm rollback rork-kiku-backend --namespace rork-kiku-production
```

---

## 6. Deployment Strategy

### 6.1. Rolling Update (default)

- Kubernetes gradually replaces old pods с новыми
- Zero downtime (если readiness probes правильно настроены)
- Config: `strategy: RollingUpdate` в Deployment

### 6.2. Blue-Green Deployment (опционально)

- Deploy new version (green) рядом со старой (blue)
- Switch traffic после verification
- **Advantage**: Instant rollback

### 6.3. Canary Deployment (advanced)

- Deploy new version к small % пользователей
- Monitor metrics (errors, latency)
- Gradually increase traffic если OK
- **Tools**: Istio, Flagger

---

## 7. Monitoring & Alerts

### 7.1. GitHub Actions Notifications

- Slack notification при build failures
- Email при deployment успеха/неудачи

**Пример** (добавить в workflow):
```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'iOS build failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 7.2. Kubernetes Monitoring

- Prometheus: Collect metrics (CPU, memory, requests)
- Grafana: Visualize metrics
- Alerts: PagerDuty/Opsgenie при критических issues

---

## 8. Rollback Plan

### 8.1. Mobile App Rollback

**TestFlight**: Previous build остаётся доступен, testers могут downgrade

**App Store**: Submit new version с fix (cannot rollback published version)

### 8.2. Backend Rollback

**Helm**:
```bash
helm rollback rork-kiku-backend -n rork-kiku-production
```

**Docker**: Redeploy previous image tag

---

## 9. Best Practices

### 9.1. CI/CD
- ✅ Run tests на каждый PR
- ✅ Automate builds на main/release branches
- ✅ Use branch protection rules (require PR reviews)
- ✅ Staged deployments (dev → staging → production)

### 9.2. Security
- ✅ Secrets в GitHub Secrets или Secrets Manager (не в code)
- ✅ Least privilege IAM roles
- ✅ Regularly rotate credentials
- ✅ Scan Docker images for vulnerabilities (Trivy, Snyk)

### 9.3. Testing
- ✅ Unit tests в CI
- ✅ Integration tests на staging environment
- ✅ E2E tests перед production deployment

---

## 10. Контакты

- **DevOps Lead**: [FOUNDERS_EMAIL]
- **Backend Lead**: [FOUNDERS_EMAIL]
- **iOS Lead**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Этот документ — черновик CI/CD процессов. Все примеры — для демонстрации и требуют адаптации под конкретный setup. Не содержит реальных секретов.
