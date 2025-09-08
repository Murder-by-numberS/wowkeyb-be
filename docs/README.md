# Documentation Index

This directory contains all documentation for the wowkeyb-be project.

## 📁 Directory Structure

### `/docs/setup/` - Setup and Configuration Guides
- **`COMPLETE_DNS_SETUP_GUIDE.md`** - Complete guide for setting up custom domains with DNS
- **`DNS_SETUP_GUIDE.md`** - Basic DNS setup guide
- **`PARAMETER_STORE_SETUP.md`** - AWS Systems Manager Parameter Store setup guide

### `/docs/deployment/` - Deployment and Operations
- **`DEPLOYMENT.md`** - Main deployment documentation
- **`SCRIPTS_README.md`** - Scripts organization and usage guide

## 🚀 Quick Start

1. **Initial Setup**: See `/docs/setup/` for environment configuration
2. **Deployment**: See `/docs/deployment/DEPLOYMENT.md` for deployment process
3. **Scripts**: See `/docs/deployment/SCRIPTS_README.md` for script usage

## 📚 Main Project Documentation

- **`../README.md`** - Main project README (in root directory)

## 🔧 Current Infrastructure

- **Backend**: AWS App Runner (3 services: develop, staging, production)
- **Frontend**: GitHub Actions → S3 + CloudFront
- **Environment Variables**: AWS Systems Manager Parameter Store
- **Custom Domains**: Route 53 + App Runner custom domains
- **CI/CD**: GitHub Actions (frontend) + App Runner auto-deploy (backend)
