# CI/CD Pipeline для Rork-Kiku

## Обзор

Continuous Integration и Continuous Deployment (CI/CD) pipeline для платформы Rork-Kiku, охватывающий:
- iOS приложение
- Backend микросервисы
- ML модели
- Infrastructure as Code (Terraform)

**Платформа**: GitHub Actions (primary)

---

## GitHub Actions Pipelines

### 1. iOS App CI/CD

**File**: `.github/workflows/ios-ci.yml`

```yaml
name: iOS CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'ios/**'
      - 'app/**' # Если React Native/Expo
  pull_request:
    branches: [ main, develop ]
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
          xcode-version: '14.3'
      
      - name: SwiftLint
        run: |
          brew install swiftlint
          cd ios
          swiftlint lint --reporter github-actions-logging
  
  unit-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '14.3'
      
      - name: Install dependencies
        run: |
          cd ios
          pod install # Если CocoaPods
      
      - name: Run unit tests
        run: |
          cd ios
          xcodebuild test \
            -workspace RorkKiku.xcworkspace \
            -scheme RorkKiku \
            -destination 'platform=iOS Simulator,name=iPhone 14,OS=16.4'
  
  build:
    runs-on: macos-latest
    needs: [lint, unit-tests]
    steps:
      - uses: actions/checkout@v3
      
      - name: Build app
        run: |
          cd ios
          xcodebuild build \
            -workspace RorkKiku.xcworkspace \
            -scheme RorkKiku \
            -configuration Debug
```

**TestFlight Deploy**: См. `docs/apple/testflight_instructions.md`

**Placeholders для secrets**:
- `FASTLANE_USER`: Apple ID (store в GitHub Secrets)
- `FASTLANE_PASSWORD`: App-specific password
- `CERTIFICATES_P12`: Base64-encoded certificate
- `MATCH_PASSWORD`: Fastlane Match password

---

### 2. Backend CI/CD

**File**: `.github/workflows/backend-ci.yml`

```yaml
name: Backend CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'backend/**'
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [auth-service, user-service, media-service, moderation-service]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend/${{ matrix.service }}
          npm ci
      
      - name: Lint
        run: |
          cd backend/${{ matrix.service }}
          npm run lint
  
  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [auth-service, user-service, media-service, moderation-service]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend/${{ matrix.service }}
          npm ci
      
      - name: Run unit tests
        run: |
          cd backend/${{ matrix.service }}
          npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/${{ matrix.service }}/coverage/lcov.info
  
  build-docker:
    runs-on: ubuntu-latest
    needs: [lint, unit-tests]
    strategy:
      matrix:
        service: [auth-service, user-service, media-service, moderation-service]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./backend/${{ matrix.service }}
          push: true
          tags: |
            ${{ secrets.DOCKER_REGISTRY }}/rork-kiku/${{ matrix.service }}:${{ github.sha }}
            ${{ secrets.DOCKER_REGISTRY }}/rork-kiku/${{ matrix.service }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

**Deploy to Kubernetes**: См. ниже (Helm deployment)

**Placeholders для secrets**:
- `DOCKER_REGISTRY`: Docker registry URL (e.g., ghcr.io, ECR)
- `DOCKER_USERNAME`: Registry username
- `DOCKER_PASSWORD`: Registry password/token

---

### 3. ML Model CI/CD

**File**: `.github/workflows/ml-ci.yml`

```yaml
name: ML Model CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'ml/**'
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          cd ml
          pip install -r requirements-dev.txt
      
      - name: Lint with flake8
        run: |
          cd ml
          flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
      
      - name: Type checking with mypy
        run: |
          cd ml
          mypy src/
  
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          cd ml
          pip install -r requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests
        run: |
          cd ml
          pytest tests/ --cov=src --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  model-validation:
    runs-on: ubuntu-latest
    needs: [lint, unit-tests]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          cd ml
          pip install -r requirements.txt
      
      - name: Validate model
        run: |
          cd ml
          python scripts/validate_model.py \
            --model-path models/latest \
            --test-data data/test_set.pkl \
            --threshold 0.95
      
      - name: Export model
        run: |
          cd ml
          python scripts/export_model.py \
            --model-path models/latest \
            --output-format torchserve
```

**Model deployment**: Deploy to SageMaker/Vertex AI (manual trigger или automated)

---

### 4. Infrastructure as Code (Terraform)

**File**: `.github/workflows/terraform-ci.yml`

```yaml
name: Terraform CI

on:
  push:
    branches: [ main ]
    paths:
      - 'terraform/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'terraform/**'

jobs:
  terraform-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform fmt
        run: terraform fmt -check -recursive
      
      - name: Terraform init
        run: |
          cd terraform
          terraform init -backend=false
      
      - name: Terraform validate
        run: |
          cd terraform
          terraform validate
  
  terraform-plan:
    runs-on: ubuntu-latest
    needs: terraform-validate
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Terraform init
        run: |
          cd terraform
          terraform init
      
      - name: Terraform plan
        run: |
          cd terraform
          terraform plan -out=tfplan
      
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            const output = require('fs').readFileSync('terraform/tfplan.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `### Terraform Plan\n\`\`\`\n${output}\n\`\`\``
            })
```

**Terraform apply**: Manual trigger (require approval)

**Placeholders для secrets**:
- `AWS_ACCESS_KEY_ID`: AWS credentials (store в GitHub Secrets или AWS OIDC)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- Или использовать **OIDC** (рекомендуется, no long-lived credentials)

---

## Helm Deployment to Kubernetes

### Helm Charts Structure

```
helm/
├── rork-kiku/
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── values-dev.yaml
│   ├── values-staging.yaml
│   ├── values-prod.yaml
│   └── templates/
│       ├── auth-service/
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── ingress.yaml
│       ├── user-service/
│       ├── media-service/
│       ├── moderation-service/
│       └── ...
```

### Deployment Pipeline

**File**: `.github/workflows/deploy-k8s.yml`

```yaml
name: Deploy to Kubernetes

on:
  workflow_run:
    workflows: ["Backend CI"]
    types:
      - completed
    branches:
      - main # Deploy на staging
      - production # Deploy на production

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'
      
      - name: Setup Helm
        uses: azure/setup-helm@v3
        with:
          version: 'latest'
      
      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=./kubeconfig
      
      - name: Deploy with Helm
        run: |
          helm upgrade --install rork-kiku ./helm/rork-kiku \
            --namespace rork-kiku \
            --create-namespace \
            --values ./helm/rork-kiku/values-staging.yaml \
            --set image.tag=${{ github.sha }}
      
      - name: Verify deployment
        run: |
          kubectl rollout status deployment/auth-service -n rork-kiku
          kubectl rollout status deployment/user-service -n rork-kiku
```

**Placeholders для secrets**:
- `KUBECONFIG`: Base64-encoded kubeconfig file (from EKS, GKE, AKS)

---

## Secret Management

### ⚠️ КРИТИЧНО: Не хранить секреты в коде

### Recommended Approaches

#### 1. GitHub Secrets (Basic)
**Usage**: CI/CD credentials, API keys

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**Setup**:
- GitHub repo > Settings > Secrets and variables > Actions > New secret

**Limitations**:
- No rotation automation
- Limited to GitHub Actions
- No fine-grained access control

---

#### 2. HashiCorp Vault (Recommended)

**Benefits**:
- Centralized secret management
- Auto-rotation
- Audit logs
- Fine-grained access control

**Integration with CI/CD**:
```yaml
- name: Import Secrets from Vault
  uses: hashicorp/vault-action@v2
  with:
    url: https://vault.rork-kiku.com
    token: ${{ secrets.VAULT_TOKEN }}
    secrets: |
      secret/data/rork-kiku/prod database_url | DATABASE_URL ;
      secret/data/rork-kiku/prod api_key | API_KEY
```

**Kubernetes integration**:
```yaml
# Use Vault Agent Injector
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/role: "rork-kiku-backend"
  vault.hashicorp.com/agent-inject-secret-database: "secret/data/rork-kiku/database"
```

---

#### 3. AWS Secrets Manager

**Benefits**:
- Native AWS integration
- Auto-rotation for RDS, etc.
- IAM-based access control

**Terraform example**:
```hcl
resource "aws_secretsmanager_secret" "database_url" {
  name = "rork-kiku/prod/database-url"
  
  rotation_rules {
    automatically_after_days = 30
  }
}
```

**CI/CD integration**:
```yaml
- name: Retrieve secrets
  run: |
    aws secretsmanager get-secret-value \
      --secret-id rork-kiku/prod/database-url \
      --query SecretString \
      --output text > .env
```

---

#### 4. Kubernetes Secrets (Basic)

**External Secrets Operator**: Sync secrets from Vault/AWS to K8s

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: rork-kiku-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: rork-kiku-secrets
    creationPolicy: Owner
  data:
  - secretKey: database-url
    remoteRef:
      key: secret/data/rork-kiku/prod
      property: database_url
```

---

## Secret Rotation Policy

**Recommendation**:
- **API Keys**: Rotate every 30 days
- **Database credentials**: Rotate every 60 days
- **TLS certificates**: Auto-renew (Let's Encrypt, cert-manager)
- **SSH keys**: Rotate every 90 days or on employee departure

**Automation**: Use Vault/AWS Secrets Manager для auto-rotation где возможно.

---

## Monitoring & Observability

### CI/CD Metrics

**Metrics to track**:
- Build success rate
- Build duration
- Deployment frequency
- Lead time (commit → production)
- Mean Time to Recovery (MTTR)

**Tools**:
- **GitHub Insights**: Built-in (Actions tab)
- **DataDog**: CI/CD monitoring
- **Honeycomb**: Observability

### Notifications

**Slack integration**:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to staging completed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

---

## Best Practices

### 1. Branch Strategy

**GitFlow**:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `hotfix/*`: Emergency fixes

**Deployments**:
- `develop` → Staging environment (auto-deploy)
- `main` → Production environment (manual approval)

### 2. Pull Request Checks

**Required checks**:
- ✅ Lint
- ✅ Unit tests (coverage > 80%)
- ✅ Integration tests
- ✅ Security scan (Snyk, Trivy)
- ✅ Code review (1+ approvals)

### 3. Versioning

**Semantic Versioning**: `MAJOR.MINOR.PATCH`

**Git tags**:
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

**Automated versioning**: Use semantic-release или similar

### 4. Rollback Strategy

**Kubernetes**:
```bash
# Rollback to previous version
kubectl rollout undo deployment/auth-service -n rork-kiku

# Rollback to specific revision
kubectl rollout undo deployment/auth-service --to-revision=2 -n rork-kiku
```

**Database migrations**: Use migration tools с rollback support (e.g., Flyway, Liquibase)

---

## Security Scanning

### 1. Dependency Scanning

**Snyk** (recommended):
```yaml
- name: Run Snyk Security Scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

**npm audit**:
```yaml
- name: npm audit
  run: npm audit --audit-level=high
```

### 2. Container Scanning

**Trivy**:
```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: rork-kiku/auth-service:${{ github.sha }}
    format: 'sarif'
    output: 'trivy-results.sarif'
```

### 3. Code Scanning

**CodeQL**:
```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: typescript, python

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

---

## Cost Optimization

### GitHub Actions Minutes

**Free tier**: 2000 minutes/month (public repos: unlimited)  
**Paid**: $0.008/minute (Linux), $0.08/minute (macOS)

**Optimization**:
- Use caching (npm, pip, Docker layers)
- Run jobs in parallel
- Use self-hosted runners для heavy workloads

### Self-Hosted Runners

**Setup**:
```bash
# On your server
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.300.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.300.0/actions-runner-linux-x64-2.300.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.300.0.tar.gz
./config.sh --url https://github.com/tc7kxsszs5-cloud/rork-kiku --token <TOKEN>
./run.sh
```

**Usage в workflow**:
```yaml
jobs:
  build:
    runs-on: self-hosted
```

---

## Terraform Hints

### Project Structure

```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── prod/
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds/
│   └── s3/
└── global/
    └── iam/
```

### Remote State

**S3 backend**:
```hcl
terraform {
  backend "s3" {
    bucket         = "rork-kiku-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

**Benefits**:
- Centralized state
- Locking (DynamoDB)
- Encryption

### Secrets in Terraform

**❌ Never hardcode secrets**:
```hcl
# BAD
resource "aws_db_instance" "default" {
  password = "MyP@ssw0rd" # NEVER do this
}
```

**✅ Use data sources**:
```hcl
# GOOD
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "rork-kiku/prod/db-password"
}

resource "aws_db_instance" "default" {
  password = data.aws_secretsmanager_secret_version.db_password.secret_string
}
```

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Все secrets и credentials должны храниться в GitHub Secrets, HashiCorp Vault, AWS Secrets Manager. НИКОГДА не commitить secrets в код.
