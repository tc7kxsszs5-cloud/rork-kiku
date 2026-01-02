# CI/CD для Rork-Kiku

## Обзор

Continuous Integration / Continuous Deployment (CI/CD) pipeline для автоматизации testing, building и deployment Rork-Kiku.

**Платформа**: GitHub Actions (primary), с примерами для GitLab CI и других

---

## GitHub Actions Pipeline

### Структура Workflows

```
.github/workflows/
├── ios-build.yml          # iOS build и TestFlight upload
├── android-build.yml      # Android build (future)
├── backend-test.yml       # Backend unit tests
├── backend-deploy.yml     # Backend deployment к Kubernetes
├── lint.yml               # Linting (ESLint, Prettier)
└── security-scan.yml      # Security scanning (Snyk, SAST)
```

---

## 1. Lint Workflow

**File**: `.github/workflows/lint.yml`

```yaml
name: Lint

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run Prettier check
        run: npm run format:check

  typescript:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: TypeScript type check
        run: npm run type-check
```

---

## 2. Backend Tests Workflow

**File**: `.github/workflows/backend-test.yml`

```yaml
name: Backend Tests

on:
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-test.yml'
  push:
    branches: [ main, develop ]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: rork_kiku_test
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/rork_kiku_test
      
      - name: Run unit tests
        run: npm run test:backend
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/rork_kiku_test
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: backend
```

---

## 3. iOS Build Workflow (Placeholder)

**File**: `.github/workflows/ios-build.yml`

```yaml
name: iOS Build

on:
  push:
    branches: [ main, release/* ]
    tags: [ 'v*' ]
  workflow_dispatch:
    inputs:
      upload_to_testflight:
        description: 'Upload to TestFlight'
        required: false
        default: 'false'

jobs:
  build:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install CocoaPods
        run: |
          cd ios
          pod install
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
          bundler-cache: true
      
      - name: Install Fastlane
        run: |
          cd ios
          bundle install
      
      # PLACEHOLDER: Apple credentials из GitHub Secrets
      # НЕ ДОБАВЛЯЙТЕ РЕАЛЬНЫЕ CREDENTIALS В КОД!
      - name: Build iOS app
        run: |
          cd ios
          bundle exec fastlane build
        env:
          # PLACEHOLDER - эти secrets должны быть созданы в GitHub
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
      
      # PLACEHOLDER: Upload к TestFlight
      # Requires proper Apple Developer access
      - name: Upload to TestFlight
        if: github.ref == 'refs/heads/main' || github.event.inputs.upload_to_testflight == 'true'
        run: |
          cd ios
          bundle exec fastlane beta
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ios-build
          path: ios/build/*.ipa
```

**Важно:** 
- Реальные credentials должны быть добавлены в GitHub Secrets
- Fastlane configuration требуется (см. ниже)
- Apple Developer access необходим

---

## 4. Backend Deployment Workflow

**File**: `.github/workflows/backend-deploy.yml`

```yaml
name: Backend Deploy

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          # PLACEHOLDER - эти credentials в GitHub Secrets
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build Docker image
        run: |
          docker build -t rork-kiku-backend:${{ github.sha }} ./backend
          docker tag rork-kiku-backend:${{ github.sha }} ${{ steps.login-ecr.outputs.registry }}/rork-kiku-backend:latest
          docker tag rork-kiku-backend:${{ github.sha }} ${{ steps.login-ecr.outputs.registry }}/rork-kiku-backend:${{ github.sha }}
      
      - name: Push Docker image to ECR
        run: |
          docker push ${{ steps.login-ecr.outputs.registry }}/rork-kiku-backend:latest
          docker push ${{ steps.login-ecr.outputs.registry }}/rork-kiku-backend:${{ github.sha }}
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'
      
      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name rork-kiku-cluster --region eu-west-1
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend-api backend-api=${{ steps.login-ecr.outputs.registry }}/rork-kiku-backend:${{ github.sha }} -n production
          kubectl rollout status deployment/backend-api -n production
      
      - name: Run database migrations
        run: |
          kubectl run migrate-${{ github.sha }} \
            --image=${{ steps.login-ecr.outputs.registry }}/rork-kiku-backend:${{ github.sha }} \
            --restart=Never \
            --command -- npm run db:migrate
          kubectl wait --for=condition=complete job/migrate-${{ github.sha }} --timeout=300s
```

---

## Fastlane Configuration

### Setup Fastlane (iOS)

**File**: `ios/Fastfile`

```ruby
default_platform(:ios)

platform :ios do
  
  desc "Build app for development"
  lane :build do
    increment_build_number(
      build_number: latest_testflight_build_number + 1
    )
    
    build_app(
      scheme: "RorkKiku",
      export_method: "app-store",
      output_directory: "./build",
      output_name: "RorkKiku.ipa"
    )
  end
  
  desc "Upload to TestFlight"
  lane :beta do
    # PLACEHOLDER: требуется Apple Developer access
    # Credentials из environment variables (GitHub Secrets)
    
    build
    
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      apple_id: ENV["APPLE_ID"],
      team_id: ENV["APPLE_TEAM_ID"],
      skip_submission: false,
      distribute_external: false,  # Only internal для pilot
      notify_external_testers: false
    )
  end
  
  desc "Submit для App Store review"
  lane :release do
    build
    
    upload_to_app_store(
      skip_metadata: false,
      skip_screenshots: false,
      submit_for_review: true,
      automatic_release: false
    )
  end
  
end
```

**Setup:**
```bash
cd ios/
bundle init
echo 'gem "fastlane"' >> Gemfile
bundle install
fastlane init
```

---

## Terraform для Infrastructure

### Basic AWS Setup (Placeholder)

**File**: `terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    # PLACEHOLDER - configure для вашего проекта
    bucket = "rork-kiku-terraform-state"
    key    = "production/terraform.tfstate"
    region = "eu-west-1"
    encrypt = true
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "rork-kiku-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  
  tags = {
    Terraform   = "true"
    Environment = var.environment
    Project     = "rork-kiku"
  }
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = "rork-kiku-cluster"
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
    
    ml_inference = {
      desired_size = 1
      min_size     = 1
      max_size     = 5
      
      instance_types = ["g4dn.xlarge"]  # GPU instances
      capacity_type  = "SPOT"
      
      labels = {
        workload = "ml-inference"
      }
      
      taints = [{
        key    = "nvidia.com/gpu"
        value  = "true"
        effect = "NoSchedule"
      }]
    }
  }
  
  tags = {
    Environment = var.environment
    Project     = "rork-kiku"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier = "rork-kiku-db"
  
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.small"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "rork_kiku"
  username = "admin"
  password = var.db_password  # PLACEHOLDER - use AWS Secrets Manager
  
  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"
  
  skip_final_snapshot = var.environment == "production" ? false : true
  
  tags = {
    Environment = var.environment
    Project     = "rork-kiku"
  }
}

# S3 Bucket для media content
resource "aws_s3_bucket" "media" {
  bucket = "rork-kiku-media-${var.environment}"
  
  tags = {
    Environment = var.environment
    Project     = "rork-kiku"
  }
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}
```

---

## Рекомендации по секретам

### GitHub Secrets (необходимые)

**Для iOS build:**
```
APPLE_ID                    # Apple Developer email
APPLE_APP_SPECIFIC_PASSWORD # App-specific password
APPLE_TEAM_ID               # Team ID из Apple Developer
MATCH_PASSWORD              # Fastlane match password
CERTIFICATES_P12_BASE64     # Base64-encoded .p12 certificate
```

**Для AWS deployment:**
```
AWS_ACCESS_KEY_ID           # IAM user access key
AWS_SECRET_ACCESS_KEY       # IAM user secret key
AWS_REGION                  # Default: eu-west-1
```

**Для database:**
```
DATABASE_URL                # PostgreSQL connection string
REDIS_URL                   # Redis connection string
```

**Для external services:**
```
SENTRY_DSN                  # Error tracking
SENDGRID_API_KEY            # Email service
STRIPE_SECRET_KEY           # Payment processing (для production)
```

### HashiCorp Vault (альтернатива)

```bash
# Setup Vault
vault kv put secret/rork-kiku/production \
  database_url="postgresql://..." \
  redis_url="redis://..." \
  jwt_secret="..."

# Retrieve в CI/CD
vault kv get -field=database_url secret/rork-kiku/production
```

### AWS Secrets Manager (рекомендуется для AWS deployments)

```bash
# Create secret
aws secretsmanager create-secret \
  --name rork-kiku/production/database \
  --secret-string '{"username":"admin","password":"..."}'

# Retrieve в application
aws secretsmanager get-secret-value --secret-id rork-kiku/production/database
```

---

## Security Scanning

### Snyk для dependency scanning

**File**: `.github/workflows/security-scan.yml`

```yaml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

---

## Monitoring и Notifications

### Slack notifications

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "CI/CD Failed: ${{ github.workflow }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Build failed*: ${{ github.repository }}\n*Branch*: ${{ github.ref }}\n*Commit*: ${{ github.sha }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Best Practices

1. **Secrets Management**:
   - ✅ Always use GitHub Secrets, Vault или AWS Secrets Manager
   - ❌ NEVER commit secrets к code
   - ✅ Rotate secrets regularly

2. **Testing**:
   - ✅ Run tests on every PR
   - ✅ Block merge if tests fail
   - ✅ Maintain > 80% code coverage

3. **Deployments**:
   - ✅ Deploy только от main/release branches
   - ✅ Use tagged releases для production
   - ✅ Blue-green или canary deployments для critical services

4. **Monitoring**:
   - ✅ Monitor CI/CD pipeline health
   - ✅ Set up alerts для failures
   - ✅ Track deployment success rate

---

**Примечание:** Все примеры являются placeholders и должны быть adapted для вашей конкретной infrastructure. Секреты должны храниться в GitHub Secrets, HashiCorp Vault, или AWS Secrets Manager — никогда не в коде.
