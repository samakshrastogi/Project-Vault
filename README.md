# Project Vault

A modern full-stack web application for managing and showcasing your projects. Built with React, TypeScript, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Project Management**: Add, edit, delete, and view projects with thumbnails
- **Admin Panel**: Administrative controls for user management
- **Responsive Design**: Modern UI with dark theme using Tailwind CSS
- **Real-time Thumbnails**: Automatic screenshot generation for project links
- **Category Filtering**: Organize projects by categories
- **Search Functionality**: Find projects quickly

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/project-vault.git
cd project-vault
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend (.env file in backend folder)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-vault
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Frontend (.env file in frontend folder - optional)
```env
VITE_API_URL=http://localhost:5000
```

### 4. Start the application

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### 5. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
project-vault/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Users can:
- Register new accounts
- Login with existing credentials
- Access protected routes
- Admin users have additional privileges

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Samaksh Rastogi**
- Email: samaksh.rastogi@nokia.com

## 🙏 Acknowledgments

- React and TypeScript for the amazing developer experience
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible NoSQL database
- All the open-source contributors

---

⭐ Star this repo if you found it helpful!