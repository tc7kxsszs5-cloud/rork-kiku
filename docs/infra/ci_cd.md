# CI/CD Pipeline для kiku

## Обзор

Этот документ описывает CI/CD (Continuous Integration / Continuous Deployment) pipeline для проекта kiku. Цель — автоматизировать процессы lint, test, build, и deploy для ускорения разработки и повышения качества кода.

**Платформа:** GitHub Actions (выбрана за native integration с GitHub)

**Альтернативы:** GitLab CI, CircleCI, Jenkins (можно адаптировать примеры ниже)

---

## GitHub Actions Pipeline

### Workflow 1: CI — Lint & Type Check

**Файл:** `.github/workflows/ci.yml`

**Триггеры:**
- Push в `main`, `develop`, `release/**` branches
- Pull requests в любые branches

**Цель:** Проверить качество кода перед merge

```yaml
name: CI - Lint & Type Check

on:
  push:
    branches:
      - main
      - develop
      - release/**
      - prepare/**
  pull_request:
    branches:
      - '**'

jobs:
  lint-and-typecheck:
    name: Lint and Type Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run ESLint
        run: bun run lint
        continue-on-error: false

      - name: Run TypeScript type check
        run: bunx tsc --noEmit
        continue-on-error: false

      - name: Check for console.logs (optional)
        run: |
          if grep -r "console.log" app/ --exclude-dir=node_modules; then
            echo "⚠️ Warning: console.log found in code"
            exit 1
          fi
        continue-on-error: true
```

**Секреты:** Не требуются

---

### Workflow 2: iOS Build & Submit to TestFlight

**Файл:** `.github/workflows/ios-testflight.yml`

**Триггеры:**
- Manual trigger (workflow_dispatch)
- Push в `main` или `release/**` branches (опционально)

**Цель:** Автоматическая сборка iOS и загрузка в TestFlight

```yaml
name: iOS Build & Submit to TestFlight

on:
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to build'
        required: true
        default: 'ios'
        type: choice
        options:
          - ios
      profile:
        description: 'Build profile'
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

  push:
    branches:
      - main
      - release/**

jobs:
  build:
    name: Build iOS App
    runs-on: macos-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build iOS app with EAS
        run: |
          eas build --platform ios --profile ${{ github.event.inputs.profile || 'production' }} --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Submit to TestFlight
        if: ${{ github.event.inputs.submit == 'true' || github.ref == 'refs/heads/main' }}
        run: |
          eas submit --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          EXPO_APPLE_ID: ${{ secrets.APPLE_ID }}
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

**Требуемые секреты:**
- `EXPO_TOKEN`: Expo access token (https://expo.dev/settings/access-tokens)
- `APPLE_ID`: [PLACEHOLDER — your-apple-id@example.com]
- `APPLE_APP_SPECIFIC_PASSWORD`: Generated на appleid.apple.com

**Альтернатива: API Key вместо App-Specific Password**

Если хотите использовать Apple API Key (более secure):

```yaml
      - name: Submit to TestFlight with API Key
        if: ${{ github.event.inputs.submit == 'true' }}
        run: |
          echo "${{ secrets.APPLE_API_KEY_JSON }}" | base64 -d > /tmp/apple-api-key.json
          eas submit --platform ios --profile production --non-interactive --apple-api-key-path /tmp/apple-api-key.json
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

**Секрет `APPLE_API_KEY_JSON`** (base64-encoded JSON):
```json
{
  "key_id": "[PLACEHOLDER]",
  "issuer_id": "[PLACEHOLDER]",
  "key": "-----BEGIN PRIVATE KEY-----\n[PLACEHOLDER]\n-----END PRIVATE KEY-----"
}
```

---

### Workflow 3: Backend Deploy to Kubernetes

**Файл:** `.github/workflows/backend-deploy.yml`

**Триггеры:**
- Push в `main` branch (автоматический deploy в staging)
- Manual trigger для production deploy

**Цель:** Deploy backend services (Node.js API) в Kubernetes cluster

```yaml
name: Backend Deploy to Kubernetes

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    name: Deploy to ${{ github.event.inputs.environment || 'staging' }}
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: kiku-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Install kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.28.0'

      - name: Configure kubeconfig
        run: |
          aws eks update-kubeconfig --name kiku-cluster --region us-east-1

      - name: Deploy with Helm
        env:
          ENVIRONMENT: ${{ github.event.inputs.environment || 'staging' }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          helm upgrade --install kiku-backend ./helm/kiku-backend \
            --namespace $ENVIRONMENT \
            --set image.tag=$IMAGE_TAG \
            --set environment=$ENVIRONMENT \
            --wait --timeout 5m

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/kiku-backend -n ${{ github.event.inputs.environment || 'staging' }}
```

**Требуемые секреты:**
- `AWS_ACCESS_KEY_ID`: AWS access key для CI/CD user
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- Kubeconfig автоматически генерируется через AWS CLI

**⚠️ ВАЖНО:** CI/CD user должен иметь ограниченные permissions (IAM policy):
- ECR push
- EKS describe-cluster
- Kubectl access (через aws-auth ConfigMap в Kubernetes)

---

### Workflow 4: Terraform Infrastructure Deploy

**Файл:** `.github/workflows/terraform-deploy.yml`

**Триггеры:**
- Manual trigger только (для безопасности, чтобы не случайно удалить infra)

**Цель:** Deploy/Update infrastructure (AWS resources) через Terraform

```yaml
name: Terraform Deploy

on:
  workflow_dispatch:
    inputs:
      action:
        description: 'Terraform action'
        required: true
        default: 'plan'
        type: choice
        options:
          - plan
          - apply
      environment:
        description: 'Environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  terraform:
    name: Terraform ${{ github.event.inputs.action }}
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0

      - name: Terraform Init
        run: |
          cd terraform/${{ github.event.inputs.environment }}
          terraform init -backend-config="bucket=kiku-terraform-state" \
                         -backend-config="key=${{ github.event.inputs.environment }}/terraform.tfstate" \
                         -backend-config="region=us-east-1"

      - name: Terraform Plan
        run: |
          cd terraform/${{ github.event.inputs.environment }}
          terraform plan -out=tfplan

      - name: Terraform Apply
        if: ${{ github.event.inputs.action == 'apply' }}
        run: |
          cd terraform/${{ github.event.inputs.environment }}
          terraform apply -auto-approve tfplan
```

**Terraform Structure:**
```
terraform/
├── staging/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── production/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

**Terraform Backend (S3):**
```hcl
terraform {
  backend "s3" {
    bucket = "kiku-terraform-state"
    key    = "staging/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}
```

**Требуемые секреты:** Те же, что для backend deploy

---

## Примеры Terraform Snippets

### AWS EKS Cluster

**Файл:** `terraform/modules/eks/main.tf`

```hcl
resource "aws_eks_cluster" "kiku" {
  name     = "kiku-cluster-${var.environment}"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
  ]

  tags = {
    Name        = "kiku-${var.environment}"
    Environment = var.environment
    Project     = "kiku"
  }
}

resource "aws_eks_node_group" "kiku" {
  cluster_name    = aws_eks_cluster.kiku.name
  node_group_name = "kiku-nodes-${var.environment}"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.desired_nodes
    max_size     = var.max_nodes
    min_size     = var.min_nodes
  }

  instance_types = ["t3.medium"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_policy,
  ]
}
```

### RDS PostgreSQL

**Файл:** `terraform/modules/rds/main.tf`

```hcl
resource "aws_db_instance" "kiku_postgres" {
  identifier           = "kiku-db-${var.environment}"
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = var.db_instance_class
  allocated_storage    = 50
  storage_encrypted    = true
  kms_key_id          = aws_kms_key.db_encryption.arn

  db_name  = "kiku"
  username = var.db_username
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.kiku.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  multi_az               = var.environment == "production" ? true : false
  skip_final_snapshot    = var.environment == "production" ? false : true
  final_snapshot_identifier = var.environment == "production" ? "kiku-db-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  tags = {
    Name        = "kiku-db-${var.environment}"
    Environment = var.environment
  }
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

# ⚠️ ВАЖНО: Сохранить password в AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "kiku/${var.environment}/db-password"
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_password.result
    host     = aws_db_instance.kiku_postgres.address
    port     = aws_db_instance.kiku_postgres.port
    dbname   = aws_db_instance.kiku_postgres.db_name
  })
}
```

### S3 for Media Storage

**Файл:** `terraform/modules/s3/main.tf`

```hcl
resource "aws_s3_bucket" "kiku_media" {
  bucket = "kiku-media-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "kiku-media-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_encryption_configuration" "kiku_media" {
  bucket = aws_s3_bucket.kiku_media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3_encryption.arn
    }
  }
}

resource "aws_s3_bucket_versioning" "kiku_media" {
  bucket = aws_s3_bucket.kiku_media.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "kiku_media" {
  bucket = aws_s3_bucket.kiku_media.id

  rule {
    id     = "delete-old-media"
    status = "Enabled"

    expiration {
      days = 180  # Удалять медиа через 6 месяцев
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "kiku_media" {
  bucket = aws_s3_bucket.kiku_media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["https://api.kiku-app.com"]  # PLACEHOLDER
    max_age_seconds = 3000
  }
}
```

---

## Helm Chart для Kubernetes Deployment

### Helm Chart Structure

```
helm/kiku-backend/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   └── secrets.yaml
```

### `Chart.yaml`

```yaml
apiVersion: v2
name: kiku-backend
description: Helm chart for kiku backend services
version: 1.0.0
appVersion: "1.0.0"
```

### `values.yaml`

```yaml
replicaCount: 2

image:
  repository: [PLACEHOLDER-AWS-ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/kiku-backend
  tag: latest
  pullPolicy: Always

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: api.kiku-app.com  # PLACEHOLDER
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: kiku-api-tls
      hosts:
        - api.kiku-app.com

env:
  NODE_ENV: production
  PORT: 3000
  DATABASE_URL_SECRET: kiku/production/db-password  # Reference to AWS Secrets Manager
  OPENAI_API_KEY_SECRET: kiku/production/openai-api-key

resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 1Gi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

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

### `templates/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "kiku-backend.fullname" . }}
  labels:
    app: {{ include "kiku-backend.name" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ include "kiku-backend.name" . }}
  template:
    metadata:
      labels:
        app: {{ include "kiku-backend.name" . }}
    spec:
      containers:
      - name: kiku-backend
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - containerPort: {{ .Values.service.targetPort }}
        env:
        - name: NODE_ENV
          value: {{ .Values.env.NODE_ENV }}
        - name: PORT
          value: "{{ .Values.env.PORT }}"
        # ⚠️ PLACEHOLDER: Использовать External Secrets Operator для загрузки из AWS Secrets Manager
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
          {{- toYaml .Values.resources | nindent 10 }}
        livenessProbe:
          {{- toYaml .Values.livenessProbe | nindent 10 }}
        readinessProbe:
          {{- toYaml .Values.readinessProbe | nindent 10 }}
```

---

## Рекомендации по секретам

### Не коммитить секреты в Git

**❌ Плохо:**
```yaml
env:
  - name: DATABASE_URL
    value: "postgresql://user:password@localhost/db"  # НИКОГДА ТАК НЕ ДЕЛАТЬ
```

**✅ Хорошо:**

### Option 1: GitHub Secrets

Для CI/CD secrets:
```yaml
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### Option 2: AWS Secrets Manager

Для production secrets:
1. **Сохранить секрет в AWS Secrets Manager:**
   ```bash
   aws secretsmanager create-secret \
     --name kiku/production/openai-api-key \
     --secret-string "sk-..."
   ```

2. **В Kubernetes: использовать External Secrets Operator**

   Install External Secrets Operator:
   ```bash
   helm repo add external-secrets https://charts.external-secrets.io
   helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace
   ```

   Create SecretStore:
   ```yaml
   apiVersion: external-secrets.io/v1beta1
   kind: SecretStore
   metadata:
     name: aws-secrets-manager
     namespace: production
   spec:
     provider:
       aws:
         service: SecretsManager
         region: us-east-1
         auth:
           jwt:
             serviceAccountRef:
               name: external-secrets-sa
   ```

   Create ExternalSecret:
   ```yaml
   apiVersion: external-secrets.io/v1beta1
   kind: ExternalSecret
   metadata:
     name: kiku-secrets
     namespace: production
   spec:
     refreshInterval: 1h
     secretStoreRef:
       name: aws-secrets-manager
       kind: SecretStore
     target:
       name: kiku-secrets
       creationPolicy: Owner
     data:
     - secretKey: openai-api-key
       remoteRef:
         key: kiku/production/openai-api-key
     - secretKey: database-url
       remoteRef:
         key: kiku/production/db-password
         property: url  # Если secret — JSON, можно извлечь property
   ```

### Option 3: HashiCorp Vault

Альтернатива AWS Secrets Manager (если multi-cloud или on-prem).

---

## Fastlane для iOS (опционально)

**Если не используете EAS для iOS builds:**

**Fastfile:**
```ruby
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "ios/kiku.xcodeproj")
    
    # Build the app
    build_app(
      scheme: "kiku",
      export_method: "app-store",
      output_directory: "./build",
      export_options: {
        provisioningProfiles: {
          "com.kiku.app" => "kiku App Store Profile"
        }
      }
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_submission: true,
      skip_waiting_for_build_processing: true
    )
  end
end
```

**GitHub Actions with Fastlane:**
```yaml
- name: Build and upload with Fastlane
  run: |
    cd ios
    bundle install
    bundle exec fastlane beta
  env:
    FASTLANE_USER: ${{ secrets.APPLE_ID }}
    FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

---

## Мониторинг CI/CD

**Рекомендация:** Интегрировать Slack notifications для CI/CD status

**GitHub Actions + Slack:**

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "❌ Build failed in ${{ github.repository }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Build Failed*\nRepository: ${{ github.repository }}\nBranch: ${{ github.ref }}\nCommit: ${{ github.sha }}"
            }
          }
        ]
      }
```

---

## Best Practices

1. **Use caching:** Speed up CI by caching dependencies
2. **Fail fast:** Run lint/typecheck before expensive builds
3. **Separate environments:** staging, production (never deploy directly to prod without testing)
4. **Manual approval для production:** Использовать workflow_dispatch или GitHub Environments with required reviewers
5. **Monitor costs:** EAS builds и GitHub Actions minutes не бесплатны на больших volumes
6. **Security scanning:** Добавить Dependabot, Snyk для dependency vulnerabilities
7. **Secrets rotation:** Регулярно менять API keys и credentials

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku DevOps Team  
**Статус:** Draft — требуется customization под actual infrastructure
