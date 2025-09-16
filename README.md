# Connect - Social Media App

A full-stack social media platform built with **React**, **TypeScript**, **Express.js**, and **PostgreSQL*8, designed to connect users through posts, real-time messaging, notifications, and friend management.

## ✨ Features

- **User Authentication:** Register, login, and logout with JWT-based authentication.
- **Posts & Media Uploads:** Create, edit, delete, like, and comment on posts with support for images.
- **Real-Time Messaging:** Instant direct messaging powered by WebSocket connections.
- **Friend System:** Send, accept, and decline friend requests. Manage a personal friend list.
- **Notifications:** Real-time alerts for likes, comments, and friend requests.
- **Search & Discovery:** Search users by username and explore new connections.
- **Responsive Design:** Mobile-friendly layout for seamless usage across devices.

## 🛠️ Tech Stack

### 🔹 Frontend

- **React + TypeScript:** Component-driven UI with type safety.
- **Vite:** Lightning-fast development environment and build tool.
- **Chakra UI:** Accessible and customizable UI component library.
- **Zustand:** Lightweight state management with minimal boilerplate.
- **Axios:** Promise-based HTTP client for API requests.
- **Socket.io-client:** Real-time WebSocket communication for chat and notifications.

### 🔸 Backend

- **Node.js + Express.js:** Fast, unopinionated web framework for building REST APIs.
- **TypeScript:** Strict typing for maintainable backend code.
- **PostgreSQL + Drizzle ORM:** Relational database with type-safe query building and migrations.
- **JWT (JSON Web Token):** Secure stateless authentication system.
- **Socket.io:** WebSocket support for real-time features (messaging & notifications).
- **Cloudinary:** Cloud storage and CDN for image uploads.
- **Multer:** Middleware for handling file uploads.

## 📂 Project Structure

```plaintext
social-media-app/
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── db/                # Database configuration
│   │   ├── drizzle/           # Database schema and migrations
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # TypeScript interfaces
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic layer
│   │   └── utils/             # Helper functions
│   ├── drizzle.config.ts      # Drizzle ORM configuration
│   ├── multer.config.ts       # File upload configuration
│   ├── package.json
│   ├── server.ts              # Express server entry point
│   └── tsconfig.json
└── frontend/                  # React client application
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── layouts/           # Page layouts
    │   ├── store/             # Zustand state management
    │   ├── subpages/          # Page-level components
    │   ├── utils/             # Utility functions
    │   └── main.tsx           # React entry point
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🚀 Getting Started

### ✅ Prerequisites

- **Node.js (v18 or higher)**
- **PostgreSQL** (installed and running)
- **Cloudinary account** (for image uploads)

### 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Hurishihara/Social-Media-App.git
cd Social-Media-App
```

2. **Setup the backend**

```bash
cd backend && npm install
```

Create a `.env` file inside `/backend`:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/social_media # replace with your database url
JWT_SECRET=your_jwt_secret_here # replace with your jwt secret
JWT_EXPIRATION=1h # # replace with your jwt expiration
CLOUD_NAME=your_cloudinary_cloud_name # replace with your cloudinary account
API_KEY=your_cloudinary_api_key # replace with your cloudinary api key
API_SECRET=your_cloudinary_api_secret # replace with your cloudinary api secret
```

Initialize the database:

```bash
npm run db:generate   # Generate migrations
npm run db:migrate    # Apply migrations
```

Run the backend server:

```bash
npm run start
```

3. **Setup the frontend**

```bash
cd ../frontend && npm install
npm run dev
```

4. **Access the app**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 📋 Usage

### 👤 User Authentication
- Register new accounts, log in/out, and stay authenticated via JWT.

### 📝 Posts & Comments
- Create, edit, and delete posts.
- Upload images with Cloudinary.
- Like and comment on posts.

### 💬 Real-Time Messaging
- Send instant messages with online presence indicators.
- Manage conversations.

### 👥 Friend System
- Send, accept, or decline friend requests.
- View and manage friend list.

### 🔔 Notifications
- Receive real-time alerts for likes, comments, and friend requests.

### 🔎 Search
- Search users by username and explore profiles.


## Note

This project is a full-stack social media platform developed for learning and demonstration purposes.
It is not intended for commercial use without further modifications.
- **Unauthorized commercial distribution** is not allowed.
- Users are solely responsible for safeguarding environment variables, credentials, and private keys.
