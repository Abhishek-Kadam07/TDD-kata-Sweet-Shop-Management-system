# 🍭 Sweet Shop Management System

A full-stack web application for managing a sweet shop, built using Test-Driven Development (TDD) methodology with Node.js, Express, MongoDB, React, and TypeScript.

## ✨ Features

- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/User)

- **Sweet Management**
  - View all available sweets
  - Search and filter functionality
  - Admin CRUD operations
  - Real-time inventory tracking

- **Inventory Management**
  - Purchase sweets (reduces quantity)
  - Restock functionality (admin only)
  - Quantity validation

- **Responsive UI**
  - Modern design with TailwindCSS
  - Mobile-friendly interface
  - Intuitive navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation & Running

#### Option 1: Automatic Startup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd sweet-shop

# Install all dependencies
npm run install:all

# Start both backend and frontend servers
npm start
```

#### Option 2: Manual Startup
```bash
# Install dependencies
npm run install:all

# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm start
```

#### Option 3: Windows Scripts
```powershell
# PowerShell (Recommended)
.\start-app.ps1

# Or Command Prompt
start-app.bat
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001 (root endpoint)

## 🔑 Test Credentials

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@sweetshop.com | admin123 |
| User  | user@sweetshop.com  | user123  |

## 📁 Project Structure

```
sweet-shop/
├── backend/                 # Node.js/Express API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Authentication middleware
│   ├── tests/              # Jest test suites
│   └── server.js           # Entry point
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── tailwind.config.js  # TailwindCSS config
├── start-app.ps1           # PowerShell startup script
├── start-app.bat           # Batch startup script
└── package.json            # Root package.json
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# All tests with coverage
npm run test
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (in-memory for development)
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest & Supertest** - Testing

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Testing Library** - Testing

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweets Management
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Create sweet (admin)
- `PUT /api/sweets/:id` - Update sweet (admin)
- `DELETE /api/sweets/:id` - Delete sweet (admin)

### Inventory
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (admin)

## 🔧 Development Methodology

This project was built using **Test-Driven Development (TDD)**:

1. **Red** - Write failing tests first
2. **Green** - Write minimal code to pass tests
3. **Refactor** - Improve code while keeping tests green

### TDD Benefits Demonstrated
- ✅ High test coverage
- ✅ Reliable codebase
- ✅ Clear requirements
- ✅ Reduced bugs
- ✅ Better design

## 🚀 Deployment

### Development
- Uses in-memory MongoDB for zero-config setup
- Hot reload for both frontend and backend
- CORS configured for development

### Production
- Set `MONGODB_URI` environment variable
- Set `JWT_SECRET` environment variable
- Use `npm run build` for optimized frontend

## 🤖 AI-Assisted Development

This project was developed with AI assistance using:
- **GitHub Copilot** - Code completion and generation
- **Cursor/Claude** - Architecture decisions and refactoring
- **TDD Approach** - AI helped write comprehensive test suites

### AI Contributions
- Generated comprehensive test cases
- Suggested optimal file structure
- Helped implement authentication flow
- Assisted with TypeScript type definitions
- Generated responsive UI components

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports 3000/3001
npx kill-port 3000 3001
```

**Dependencies Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Database Connection**
- Uses in-memory MongoDB for development
- No external database setup required

## 📄 License

MIT License - see LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests first (TDD)
4. Implement features
5. Ensure all tests pass
6. Submit a pull request

---

🍭 **Sweet Shop Management System** - Built with ❤️ using TDD methodology