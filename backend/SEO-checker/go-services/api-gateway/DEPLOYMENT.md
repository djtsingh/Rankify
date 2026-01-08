# Rankify Go API Gateway - Azure Container Apps Deployment

## Prerequisites

1. Azure CLI installed and logged in
2. Docker installed (for local testing)
3. Azure Container Registry (ACR) created

## Quick Deployment Commands

### 1. Create Azure Container Registry (if not exists)

```bash
# Set variables
RESOURCE_GROUP="rankify"
ACR_NAME="rankifyacr"
LOCATION="centralindia"

# Create ACR
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true
```

### 2. Build and Push Docker Image

```bash
# Login to ACR
az acr login --name $ACR_NAME

# Build and push in one command
az acr build \
  --registry $ACR_NAME \
  --image rankify-go-api:latest \
  --file Dockerfile \
  .
```

### 3. Create Container Apps Environment (if not exists)

```bash
ENVIRONMENT_NAME="rankify-env"

az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

### 4. Deploy Container App

```bash
# Get ACR credentials
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Deploy container app
az containerapp create \
  --name rankify-go-api \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image ${ACR_NAME}.azurecr.io/rankify-go-api:latest \
  --target-port 8080 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 3 \
  --cpu 0.5 \
  --memory 1Gi \
  --registry-server ${ACR_NAME}.azurecr.io \
  --registry-username $ACR_NAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    DB_HOST=rankify-v1-data.postgres.database.azure.com \
    DB_PORT=5432 \
    DB_NAME=postgres \
    DB_USER=djtpgadmin \
    DB_PASSWORD=secretref:db-password \
    NATS_URL=nats://nats:4222 \
    PORT=8080 \
    GIN_MODE=release \
  --secrets db-password=YOUR_DB_PASSWORD_HERE
```

### 5. Get Container App URL

```bash
az containerapp show \
  --name rankify-go-api \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  -o tsv
```

### 6. Update Azure Functions with Go API URL

```bash
GO_API_URL="https://$(az containerapp show --name rankify-go-api --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)"

az functionapp config appsettings set \
  --name rankify-v1-src \
  --resource-group $RESOURCE_GROUP \
  --settings GO_API_URL=$GO_API_URL
```

## Local Testing

```bash
# Build locally
docker build -t rankify-go-api:local .

# Run locally
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=rankify \
  -e DB_USER=djt_rankify_1 \
  -e DB_PASSWORD=djtrankify1 \
  -e NATS_URL=nats://host.docker.internal:4222 \
  -e GIN_MODE=debug \
  rankify-go-api:local

# Test
curl http://localhost:8080/api/v1/health
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DB_HOST | PostgreSQL host | Yes |
| DB_PORT | PostgreSQL port (default: 5432) | Yes |
| DB_NAME | Database name | Yes |
| DB_USER | Database user | Yes |
| DB_PASSWORD | Database password | Yes |
| NATS_URL | NATS server URL | Yes |
| PORT | Server port (default: 8080) | No |
| GIN_MODE | Gin mode (debug/release) | No |

## Troubleshooting

### Check Container Logs
```bash
az containerapp logs show \
  --name rankify-go-api \
  --resource-group $RESOURCE_GROUP \
  --follow
```

### Restart Container
```bash
az containerapp revision restart \
  --name rankify-go-api \
  --resource-group $RESOURCE_GROUP
```

### Scale Container
```bash
az containerapp update \
  --name rankify-go-api \
  --resource-group $RESOURCE_GROUP \
  --min-replicas 1 \
  --max-replicas 5
```
