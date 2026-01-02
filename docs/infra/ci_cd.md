# CI/CD Pipeline для Rork-Kiku

## Обзор

Этот документ описывает CI/CD (Continuous Integration / Continuous Deployment) setup для проекта Rork-Kiku, включая GitHub Actions workflows, инфраструктурные automation tools, и best practices.

---

## Архитектура CI/CD

```
┌──────────────┐
│  Developer   │
│  Git Push    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│       GitHub (Code Repository)        │
└──────┬─────────────────────┬─────────┘
       │                     │
       │ Triggers            │ Triggers
       ▼                     ▼
┌─────────────────┐  ┌──────────────────────┐
│ GitHub Actions  │  │  GitHub Actions      │
│ (CI Pipeline)   │  │  (iOS Build & Deploy)│
│                 │  │                      │
│ 1. Lint         │  │  1. EAS Build        │
│ 2. Type Check   │  │  2. Submit TestFlight│
│ 3. Unit Tests   │  │  3. Notify Team      │
│ 4. Security Scan│  │                      │
└────────┬────────┘  └──────────┬───────────┘
         │                      │
         ▼                      ▼
┌────────────────────┐   ┌─────────────────┐
│  Backend Deploy    │   │  TestFlight     │
│  (Kubernetes/AWS)  │   │  (iOS Beta)     │
└────────────────────┘   └─────────────────┘
```

---

## GitHub Actions Workflows

### 1. CI Workflow (Lint & Test)

**File**: `.github/workflows/ci.yml`

```yaml
name: CI - Lint & Type Check

on:
  push:
    branches:
      - main
      - develop
      - 'feature/**'
  pull_request:
    branches:
      - main
      - develop

jobs:
  lint-and-test:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint
        run: npm run lint
        
      - name: Run TypeScript check
        run: npm run ci:tsc
        
      - name: Run tests (if available)
        run: npm run test
        if: success()
        
      - name: Upload coverage (optional)
        uses: codecov/codecov-action@v3
        if: success()
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
```

**Triggers**:
- Push to main, develop, feature branches
- Pull requests to main, develop

**Duration**: 2-5 минут

### 2. iOS Build & Deploy (TestFlight)

**File**: `.github/workflows/ios-deploy.yml`

```yaml
name: iOS - Build & Deploy to TestFlight

on:
  push:
    branches:
      - main
      - 'release/**'
  workflow_dispatch:
    inputs:
      submit_to_testflight:
        description: 'Submit to TestFlight after build'
        required: false
        default: 'true'

jobs:
  build-ios:
    name: Build iOS App
    runs-on: macos-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build iOS with EAS
        run: eas build --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          
      - name: Submit to TestFlight
        if: github.event.inputs.submit_to_testflight != 'false'
        run: eas submit --platform ios --latest --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          
      - name: Notify on Slack (optional)
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "iOS Build ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "iOS Build *${{ job.status }}*\nBranch: `${{ github.ref }}`\nCommit: `${{ github.sha }}`"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Triggers**:
- Push to main, release/** branches
- Manual dispatch (workflow_dispatch)

**Duration**: 15-25 минут (build на Expo servers)

### 3. Backend Deploy (Kubernetes)

**File**: `.github/workflows/backend-deploy.yml`

```yaml
name: Backend - Deploy to Kubernetes

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  EKS_CLUSTER_NAME: rork-kiku-prod
  DOCKER_REGISTRY: ghcr.io
  IMAGE_NAME: rork-kiku-backend

jobs:
  build-and-deploy:
    name: Build & Deploy Backend
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
          
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ${{ env.DOCKER_REGISTRY }}/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.DOCKER_REGISTRY }}/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:latest
          cache-from: type=registry,ref=${{ env.DOCKER_REGISTRY }}/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:latest
          cache-to: type=inline
          
      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER_NAME }} --region ${{ env.AWS_REGION }}
          
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/rork-kiku-api \
            api=${{ env.DOCKER_REGISTRY }}/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production
          kubectl rollout status deployment/rork-kiku-api -n production --timeout=5m
          
      - name: Verify deployment
        run: |
          kubectl get pods -n production -l app=rork-kiku-api
          kubectl get svc -n production -l app=rork-kiku-api
```

**Triggers**:
- Push to main (только если изменились файлы в backend/)
- Manual dispatch

**Duration**: 5-10 минут

---

## Infrastructure as Code (Terraform)

### Terraform Setup

**File**: `infrastructure/terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket         = "rork-kiku-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "rork-kiku"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "rork-kiku-${var.environment}"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = 3
      min_size     = 2
      max_size     = 10

      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
    }
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier     = "rork-kiku-${var.environment}"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds.arn
  
  db_name  = "rork_kiku"
  username = "admin"
  password = random_password.db_password.result
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "rork-kiku-${var.environment}-final-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "rork-kiku-${var.environment}"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}

# S3 Bucket (for user uploads, ML models, etc.)
resource "aws_s3_bucket" "main" {
  bucket = "rork-kiku-${var.environment}-data"
}

resource "aws_s3_bucket_encryption" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

# KMS Keys
resource "aws_kms_key" "rds" {
  description             = "RDS encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_kms_key" "s3" {
  description             = "S3 encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}
```

### Apply Terraform

```bash
cd infrastructure/terraform

# Initialize
terraform init

# Plan (preview changes)
terraform plan -var-file=production.tfvars

# Apply
terraform apply -var-file=production.tfvars

# (Enter 'yes' to confirm)
```

**In CI/CD** (GitHub Actions):
```yaml
- name: Terraform Plan
  run: terraform plan -var-file=production.tfvars -out=tfplan
  
- name: Terraform Apply
  if: github.ref == 'refs/heads/main'
  run: terraform apply -auto-approve tfplan
```

---

## Kubernetes Deployment

### Deployment Manifest

**File**: `k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rork-kiku-api
  namespace: production
  labels:
    app: rork-kiku-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rork-kiku-api
  template:
    metadata:
      labels:
        app: rork-kiku-api
    spec:
      containers:
      - name: api
        image: ghcr.io/rork-kiku/backend:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-credentials
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: jwt-secret
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
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: rork-kiku-api
  namespace: production
spec:
  selector:
    app: rork-kiku-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: rork-kiku-api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: rork-kiku-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Apply Kubernetes manifests

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

---

## Secrets Management

### GitHub Secrets (для CI/CD)

**Required secrets** (в GitHub repo → Settings → Secrets):

**iOS/Mobile**:
- `EXPO_TOKEN` — Expo access token
- `APPLE_ID` — Apple Developer email
- `APPLE_APP_SPECIFIC_PASSWORD` — App-specific password

**Backend/AWS**:
- `AWS_ACCESS_KEY_ID` — AWS IAM access key
- `AWS_SECRET_ACCESS_KEY` — AWS IAM secret key
- `DOCKER_REGISTRY_TOKEN` — GitHub token для GHCR

**Notifications** (optional):
- `SLACK_WEBHOOK_URL` — Slack webhook для CI notifications

### Kubernetes Secrets

**Create secrets**:
```bash
# Database credentials
kubectl create secret generic db-credentials \
  --from-literal=url="postgresql://user:password@host:5432/rork_kiku" \
  -n production

# Redis credentials
kubectl create secret generic redis-credentials \
  --from-literal=url="redis://host:6379" \
  -n production

# API secrets
kubectl create secret generic api-secrets \
  --from-literal=jwt-secret="your-jwt-secret" \
  -n production
```

⚠️ **ВАЖНО**: Не храните секреты в git!

**Better approach**: Используйте [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) или [External Secrets](https://external-secrets.io/) для управления секретами в git-friendly way.

---

## Monitoring & Logging

### Prometheus + Grafana

**Install**:
```bash
# Add Helm repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace

# Install Grafana
helm install grafana grafana/grafana \
  --namespace monitoring
```

**Access**:
```bash
# Prometheus
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090

# Grafana
kubectl port-forward -n monitoring svc/grafana 3000:80
```

**Dashboards**: Import pre-built dashboards для Kubernetes, Node.js, PostgreSQL

### Logging (ELK Stack или CloudWatch)

**Option A: CloudWatch Logs** (easier, managed):
```bash
# Install Fluent Bit для forwarding logs к CloudWatch
kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/fluent-bit/fluent-bit.yaml
```

**Option B: ELK Stack** (self-hosted):
```bash
# Install Elasticsearch, Logstash, Kibana
helm install elasticsearch elastic/elasticsearch -n logging
helm install kibana elastic/kibana -n logging
helm install filebeat elastic/filebeat -n logging
```

---

## Security Scanning

### 1. Dependency Scanning

**GitHub Actions** (automatic):
```yaml
- name: Run Dependency Audit
  run: npm audit --audit-level=high
```

**Tools**:
- `npm audit` (built-in)
- Snyk (third-party, more comprehensive)
- Dependabot (GitHub, automatic PRs)

### 2. SAST (Static Application Security Testing)

**GitHub Actions**:
```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: typescript, javascript
    
- name: Autobuild
  uses: github/codeql-action/autobuild@v2
  
- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

**Tools**:
- GitHub CodeQL (recommended, free for public repos)
- SonarQube
- Semgrep

### 3. Container Scanning

**Scan Docker images**:
```yaml
- name: Scan Docker image with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'ghcr.io/rork-kiku/backend:latest'
    format: 'sarif'
    output: 'trivy-results.sarif'
    
- name: Upload Trivy results to GitHub Security
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: 'trivy-results.sarif'
```

---

## Best Practices

### 1. Branch Strategy

**GitFlow**:
- `main` — production code (always deployable)
- `develop` — integration branch (latest features)
- `feature/*` — feature branches (branch off develop)
- `release/*` — release candidates (branch off develop)
- `hotfix/*` — urgent fixes (branch off main)

### 2. Commit Messages

**Format**:
```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:
```
feat(auth): add JWT refresh token support

Implemented refresh token rotation for improved security.
Tokens expire after 15 minutes, refresh tokens after 7 days.

Closes #123
```

### 3. Pull Request Workflow

1. Create feature branch
2. Develop + commit
3. Push to GitHub
4. Open PR (use PR template)
5. CI runs automatically
6. Code review
7. Approve + merge
8. Automatic deployment (if main branch)

### 4. Environment Strategy

**Environments**:
- **Development** — feature branches, автоматический deploy
- **Staging** — develop branch, pre-production testing
- **Production** — main branch, manual approval (или automatic после tests)

---

**Автор**: DevOps Team, Rork-Kiku  
**Версия**: v0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Ready для implementation  
**Обновление**: По мере добавления новых CI/CD компонентов
