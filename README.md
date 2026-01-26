# Personal Portfolio with Admin CMS

A modern, fullstack personal portfolio website with a secure admin dashboard for content management.

![Portfolio](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan) ![Express](https://img.shields.io/badge/Express-4-green) ![SQLite](https://img.shields.io/badge/SQLite-3-blue)

## ✨ Features

### Public Portfolio
- **Hero** - Animated introduction with avatar, name, title, and social links
- **About** - Bio section with profile picture and contact info
- **Skills** - Categorized skills with progress bars
- **Projects** - Gallery of projects with images, descriptions, and links
- **Experience** - Timeline of work experience
- **Contact** - Contact form that saves messages to the database

### Admin Dashboard
- **Secure Login** - JWT authentication
- **Profile Management** - Edit name, title, bio, avatar, and contact info
- **Skills CRUD** - Add, edit, delete skills with categories and proficiency
- **Projects CRUD** - Manage projects with image upload
- **Experience CRUD** - Add/edit work history
- **Social Links** - Manage GitHub, LinkedIn, Twitter, etc.
- **Messages Inbox** - View and manage contact form submissions

### UI/UX
- 🌙 Dark/Light mode with system preference detection
- 🎨 Modern glassmorphism design
- ✨ Smooth Framer Motion animations
- 📱 Fully responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone and enter directory
cd my-portfolio

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Access

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Public portfolio |
| http://localhost:5173/admin/login | Admin login |

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

> ⚠️ **Important:** Change the default password after first login!

## 📁 Project Structure

```
my-portfolio/
├── server/                 # Backend (Express + SQLite)
│   ├── src/
│   │   ├── config/        # Database setup
│   │   ├── middleware/    # Auth & upload middleware
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry
│   ├── uploads/           # Uploaded images
│   └── data/              # SQLite database
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── index.html
│
└── README.md
```

## 🔌 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile data |
| GET | `/api/skills` | Get all skills |
| GET | `/api/projects` | Get all projects |
| GET | `/api/experience` | Get all experience |
| GET | `/api/social` | Get social links |
| POST | `/api/contact` | Submit contact form |

### Protected Endpoints (require JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| PUT | `/api/profile` | Update profile |
| POST | `/api/profile/avatar` | Upload avatar |
| CRUD | `/api/skills/*` | Manage skills |
| CRUD | `/api/projects/*` | Manage projects |
| CRUD | `/api/experience/*` | Manage experience |
| CRUD | `/api/social/*` | Manage social links |
| GET | `/api/messages` | Get all messages |

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite 5
- TailwindCSS 3
- Framer Motion
- React Router DOM 6
- Axios

**Backend:**
- Node.js
- Express 4
- better-sqlite3
- jsonwebtoken
- bcryptjs
- Multer (file uploads)

## 📝 Environment Variables

Create `.env` in `/server`:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## 🚢 Production Build

```bash
# Build frontend
cd client
npm run build

# The dist folder can be served statically
# Configure your server to serve the built files
```

## 📄 License

MIT License - Feel free to use for your own portfolio!
