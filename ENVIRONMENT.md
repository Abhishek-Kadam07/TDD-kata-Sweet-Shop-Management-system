# Environment Setup Guide

## Backend Environment Configuration

### 1. Copy Environment File
```bash
cd backend
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your specific values:

```env
# Environment
NODE_ENV=development

# Server Configuration  
PORT=3001
HOST=localhost

# MongoDB Configuration
# For production: add your MongoDB Atlas connection string
# For development: leave empty to use in-memory MongoDB
MONGODB_URI=

# JWT Configuration
# IMPORTANT: Generate a strong secret key for production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Admin User Configuration (for seeding)
ADMIN_EMAIL=admin@sweetshop.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User

# Regular User Configuration (for seeding)
USER_EMAIL=user@sweetshop.com
USER_PASSWORD=user123
USER_NAME=John Customer

# App Configuration
APP_NAME=Sweet Shop Management System
API_VERSION=1.0.0

# Security Configuration
BCRYPT_ROUNDS=12

# Database Configuration
DB_SEED_DATA=true
```

### 3. Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS:**

1. **JWT Secret**: Always use a strong, unique JWT secret in production
2. **Environment Files**: Never commit `.env` files to Git
3. **Default Passwords**: Change default admin/user passwords for production
4. **MongoDB URI**: Use secure connection strings for production databases
5. **CORS Origin**: Configure appropriate CORS origins for production

### 4. Production Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Configure a production MongoDB URI
3. Generate a secure JWT secret (recommended: 64+ characters)
4. Change default admin/user credentials
5. Set appropriate CORS origins
6. Consider using environment variable management services

### 5. Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `3001` | No |
| `HOST` | Server host | `localhost` | No |
| `MONGODB_URI` | MongoDB connection string | (in-memory) | No |
| `JWT_SECRET` | JWT signing secret | `fallback-secret` | **Yes** |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | No |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` | No |
| `ADMIN_EMAIL` | Admin user email | `admin@sweetshop.com` | No |
| `ADMIN_PASSWORD` | Admin user password | `admin123` | No |
| `ADMIN_NAME` | Admin user name | `Admin User` | No |
| `USER_EMAIL` | Regular user email | `user@sweetshop.com` | No |
| `USER_PASSWORD` | Regular user password | `user123` | No |
| `USER_NAME` | Regular user name | `John Customer` | No |
| `APP_NAME` | Application name | `Sweet Shop Management System` | No |
| `API_VERSION` | API version | `1.0.0` | No |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` | No |
| `DB_SEED_DATA` | Enable sample data seeding | `true` | No |

### 6. Quick Start

1. Copy environment file: `cp .env.example .env`
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Run tests: `npm test`

The application will automatically:
- Create an in-memory MongoDB instance
- Seed sample data
- Create test users
- Start the API server on the configured port