# CI/CD Pipeline Documentation для Rork-Kiku

## Обзор

Этот документ описывает CI/CD инфраструктуру для автоматизации testing, building, и deployment платформы Rork-Kiku.

## Стек CI/CD

**Primary:** GitHub Actions
**Alternative:** GitLab CI, CircleCI

**Reasons для GitHub Actions:**
- Native integration с GitHub
- Free для open source / generous free tier
- MacOS runners доступны (iOS builds)
- Широкая ecosystem

---

## Pipeline Structure

### 1. CI Pipeline (Continuous Integration)

**Trigger:** Push to any branch, Pull Request

**Jobs:**
1. **Lint:** ESLint
2. **Type Check:** TypeScript
3. **Unit Tests:** Jest
4. **Build:** Test compilation

**Runtime:** ~5-10 minutes

### 2. Build Pipeline (iOS/Android)

**Trigger:** Manual или push to `main`/`release/**`

**Jobs:**
1. **Build iOS:** EAS Build
2. **Build Android:** EAS Build (future)

**Runtime:** ~15-30 minutes

### 3. Deploy Pipeline (Backend)

**Trigger:** Merge to `main`

**Jobs:**
1. **Build Docker images**
2. **Push to registry**
3. **Deploy to Kubernetes**
4. **Run smoke tests**

**Runtime:** ~10-15 minutes

---

## GitHub Actions Workflows

### File: `.github/workflows/ci.yml`

```yaml
name: CI (Lint & Type Check)

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
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Run ESLint
        run: bun run lint

  typecheck:
    name: TypeScript Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: TypeScript check
        run: bunx tsc --noEmit

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Run tests
        run: bun test
```

### File: `.github/workflows/build-ios.yml`

См. `docs/apple/testflight_instructions.md` для полного примера

### File: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ${{ github.repository }}

jobs:
  build-and-push:
    name: Build & Push Docker Images
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    strategy:
      matrix:
        service:
          - auth-service
          - user-service
          - content-service
          - moderation-service
          - notification-service
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./backend/${{ matrix.service }}
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/${{ matrix.service }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/${{ matrix.service }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy to Kubernetes
    runs-on: ubuntu-latest
    needs: build-and-push
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure kubectl
        run: |
          mkdir -p ~/.kube
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > ~/.kube/config
      
      - name: Deploy with Helm
        run: |
          helm upgrade --install rork-kiku ./helm/rork-kiku \
            --namespace production \
            --set image.tag=${{ github.sha }} \
            --wait --timeout 10m

      - name: Smoke tests
        run: |
          kubectl rollout status deployment/auth-service -n production
          kubectl rollout status deployment/user-service -n production
          # Add more health checks
```

---

## Secret Management

### GitHub Secrets Configuration

**Required Secrets:**

| Secret Name | Description | Used By |
|-------------|-------------|---------|
| `EXPO_TOKEN` | Expo access token | iOS/Android builds |
| `APPLE_API_KEY_CONTENT` | Base64 .p8 file | iOS submit |
| `APPLE_API_KEY_ID` | App Store Connect Key ID | iOS submit |
| `APPLE_API_KEY_ISSUER_ID` | Issuer ID | iOS submit |
| `KUBECONFIG` | Kubernetes config (base64) | Backend deploy |
| `AWS_ACCESS_KEY_ID` | AWS credentials | Infrastructure |
| `AWS_SECRET_ACCESS_KEY` | AWS secret | Infrastructure |
| `DATABASE_URL` | PostgreSQL connection | Backend |
| `REDIS_URL` | Redis connection | Backend |
| `JWT_SECRET` | JWT signing key | Backend |

**Storage Recommendations:**

**Option 1: GitHub Secrets (Current)**
- ✅ Easy to use
- ✅ Integrated
- ⚠️ Limited to GitHub Actions
- ⚠️ No secrets rotation automation

**Option 2: HashiCorp Vault (Future)**
- ✅ Centralized secret management
- ✅ Automated rotation
- ✅ Audit logging
- ❌ Additional infrastructure cost
- ❌ Complexity

**Option 3: AWS Secrets Manager (Future)**
- ✅ Integrated с AWS
- ✅ Automated rotation
- ✅ IAM policies
- ❌ AWS-specific
- ❌ Additional cost

**Recommendation для MVP:** GitHub Secrets → migrate to HashiCorp Vault или AWS Secrets Manager при Series A

---

## Terraform для Infrastructure as Code

### Structure

```
/terraform/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── production/
├── modules/
│   ├── kubernetes/
│   ├── database/
│   ├── storage/
│   └── networking/
└── backend.tf
```

### Example: Kubernetes Cluster

```hcl
# terraform/modules/kubernetes/main.tf

provider "aws" {
  region = var.region
}

resource "aws_eks_cluster" "rork_kiku" {
  name     = "rork-kiku-${var.environment}"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}

resource "aws_eks_node_group" "workers" {
  cluster_name    = aws_eks_cluster.rork_kiku.name
  node_group_name = "rork-kiku-workers"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.desired_nodes
    max_size     = var.max_nodes
    min_size     = var.min_nodes
  }

  instance_types = [var.instance_type]
}
```

### Terraform Workflow

```bash
# Initialize
terraform init

# Plan (review changes)
terraform plan -var-file=environments/production/terraform.tfvars

# Apply (after review)
terraform apply -var-file=environments/production/terraform.tfvars
```

---

## Helm Charts

### Structure

```
/helm/
└── rork-kiku/
    ├── Chart.yaml
    ├── values.yaml
    ├── values-dev.yaml
    ├── values-staging.yaml
    ├── values-production.yaml
    └── templates/
        ├── auth-service.yaml
        ├── user-service.yaml
        ├── content-service.yaml
        ├── moderation-service.yaml
        ├── notification-service.yaml
        ├── ingress.yaml
        └── secrets.yaml
```

### Example: Service Deployment

```yaml
# helm/rork-kiku/templates/auth-service.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: {{ .Values.namespace }}
spec:
  replicas: {{ .Values.authService.replicas }}
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: {{ .Values.image.registry }}/auth-service:{{ .Values.image.tag }}
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: rork-kiku-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: rork-kiku-secrets
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
```

### Helm Deployment

```bash
# Install
helm install rork-kiku ./helm/rork-kiku \
  --namespace production \
  --values ./helm/rork-kiku/values-production.yaml

# Upgrade
helm upgrade rork-kiku ./helm/rork-kiku \
  --namespace production \
  --values ./helm/rork-kiku/values-production.yaml \
  --set image.tag=abc123

# Rollback
helm rollback rork-kiku 1 --namespace production
```

---

## Monitoring & Observability

### Prometheus + Grafana

**Install via Helm:**

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

**Metrics to Monitor:**
- Request rate, latency, errors (RED method)
- CPU, memory, disk usage
- ML inference latency
- Moderation queue length
- Database connections, query time

### Logging (ELK Stack or CloudWatch)

**Option 1: CloudWatch Logs (AWS)**
```bash
# Fluentd DaemonSet для forward logs
kubectl apply -f https://raw.githubusercontent.com/aws/amazon-cloudwatch-logs-for-fluent-bit/mainline/docs/setup/fluent-bit.yaml
```

**Option 2: ELK Stack**
```bash
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch --namespace logging
helm install kibana elastic/kibana --namespace logging
helm install filebeat elastic/filebeat --namespace logging
```

**Log Aggregation:**
- All microservices → Fluentd → CloudWatch/Elasticsearch
- Structured JSON logging
- Centralized search & analysis

---

## Deployment Strategies

### Blue-Green Deployment

**Concept:** Two identical environments (Blue и Green), switch traffic

**Implementation:**
```yaml
# helm/rork-kiku/values.yaml
deployment:
  strategy:
    type: BlueGreen
    blueGreen:
      autoPromotionEnabled: false
      previewService: auth-service-preview
      activeService: auth-service
```

### Canary Deployment

**Concept:** Gradual rollout (5% → 25% → 50% → 100%)

**Implementation:** Use Istio or Argo Rollouts

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: auth-service
spec:
  replicas: 4
  strategy:
    canary:
      steps:
      - setWeight: 25
      - pause: {duration: 5m}
      - setWeight: 50
      - pause: {duration: 5m}
      - setWeight: 75
      - pause: {duration: 5m}
```

### Rolling Update (Default)

**Kubernetes default:** Gradual replacement pods

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

---

## Testing в CI/CD

### Unit Tests

```bash
bun test --coverage
```

**Coverage Target:** > 70%

### Integration Tests

```bash
bun test:integration
```

**Tests:** API endpoints, database interactions

### E2E Tests (Future)

```bash
npx detox test --configuration ios.sim.release
```

**Platform:** Detox (React Native E2E)

### Load Testing (Pre-Launch)

```bash
k6 run load-test.js
```

**Tool:** k6 или Apache JMeter
**Targets:** 1000 concurrent users, p95 latency < 500ms

---

## Rollback Procedures

### Kubernetes Deployment Rollback

```bash
# List revisions
kubectl rollout history deployment/auth-service -n production

# Rollback to previous
kubectl rollout undo deployment/auth-service -n production

# Rollback to specific revision
kubectl rollout undo deployment/auth-service -n production --to-revision=5
```

### Helm Rollback

```bash
# List releases
helm history rork-kiku --namespace production

# Rollback
helm rollback rork-kiku 2 --namespace production
```

### Database Migration Rollback

**Use migration tool:** Prisma, TypeORM, Flyway

```bash
# Prisma example
npx prisma migrate down
```

**⚠️ CAUTION:** Database rollbacks risky. Always test в staging.

---

## Cost Optimization

### CI/CD Costs

**GitHub Actions:**
- Free tier: 2,000 minutes/month (Linux), 10 GB storage
- Paid: $0.008/minute (Linux), $0.08/minute (macOS)

**Optimization:**
- Cache dependencies (`actions/cache`)
- Use matrix builds efficiently
- Limit macOS builds (expensive)
- Use self-hosted runners (future)

### Infrastructure Costs

**Monitor:**
- AWS Cost Explorer
- Kubernetes resource usage
- Unused resources (orphaned volumes, etc.)

**Optimize:**
- Right-size instances
- Use spot instances для non-critical workloads
- Auto-scaling (scale down в off-hours)
- Reserved instances (для production, after stable)

---

## Security Best Practices

### Secret Scanning

**Tool:** GitGuardian, GitHub Secret Scanning

**Prevent:**
- Pre-commit hooks (detect secrets before commit)
- `.gitignore` для sensitive files

### Dependency Scanning

**Tool:** Dependabot, Snyk

**Auto-update:**
- GitHub Dependabot enabled
- Weekly security updates

### Container Scanning

**Tool:** Trivy, Clair

```yaml
# Add to CI
- name: Run Trivy scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.REGISTRY }}/${{ matrix.service }}:${{ github.sha }}
    format: 'sarif'
    output: 'trivy-results.sarif'
```

### SAST (Static Application Security Testing)

**Tool:** CodeQL, SonarQube

```yaml
# Add to CI
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: typescript

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

---

## Disaster Recovery

### Backup Strategy

**Database:**
- Automated daily backups
- Point-in-time recovery enabled
- Cross-region backup (для DR)

**Object Storage (S3):**
- Versioning enabled
- Cross-region replication

**Kubernetes:**
- Velero для cluster backups
- Backup всех configurations

### RTO/RPO

**Recovery Time Objective (RTO):** < 1 hour
**Recovery Point Objective (RPO):** < 5 minutes

### DR Plan

1. **Detection:** Monitoring alert
2. **Assessment:** Incident commander evaluates
3. **Failover:** Switch to backup region (if needed)
4. **Recovery:** Restore from backup
5. **Verification:** Test all functionality
6. **Post-mortem:** Document and improve

---

## Next Steps

1. [ ] Set up GitHub Actions workflows
2. [ ] Configure Terraform for infrastructure
3. [ ] Create Helm charts
4. [ ] Set up monitoring (Prometheus + Grafana)
5. [ ] Configure logging (CloudWatch or ELK)
6. [ ] Implement automated testing
7. [ ] Document rollback procedures
8. [ ] Set up disaster recovery

---

**Контакт:** [FOUNDERS_EMAIL]

**Related Documents:**
- `docs/apple/testflight_instructions.md` - iOS CI/CD
- `docs/security/security_design.md` - Security practices
- `docs/architecture/architecture.md` - Infrastructure overview
