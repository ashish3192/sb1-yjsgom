# Driver Management Platform

A comprehensive platform for managing drivers, including a mobile app for drivers and a web admin panel.

## Project Structure

```
apps/
  ├── mobile/        # React Native mobile app for drivers
  ├── web/           # Next.js web app for admin panel
  └── api/           # Express.js backend API
packages/
  ├── database/      # Database models and migrations
  ├── shared/        # Shared types and utilities
  └── config/        # Shared configuration
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Azure Account (for deployment)
- Docker (for local development)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start development servers:
   ```bash
   npm run dev
   ```

## Deployment

### Azure Setup

1. Create Azure resources:
   - App Service for Web App
   - App Service for API
   - PostgreSQL Flexible Server
   - Blob Storage Account
   - Azure Container Registry

2. Configure GitHub Actions for CI/CD:
   - Add Azure credentials to GitHub secrets
   - Push to main branch to trigger deployment

### Manual Deployment

1. Build applications:
   ```bash
   npm run build
   ```

2. Deploy using Azure CLI:
   ```bash
   az webapp up --name your-app-name --resource-group your-rg
   ```