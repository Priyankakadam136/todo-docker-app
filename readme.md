# 🚀 Dockerized Todo Application

A full-stack Todo application built with **React, Vite, Node.js, Express, MongoDB, Docker, and Nginx**.

The project demonstrates containerization, Docker Compose orchestration, persistent database storage, API communication, and frontend development with Vite Hot Module Replacement (HMR).

## ✨ Features

- Add, complete, and delete tasks
- Filter tasks by All, Active, and Completed
- Dashboard with task summary cards
- Responsive and user-friendly interface
- REST API integration
- MongoDB data persistence using Docker volumes
- Nginx reverse proxy for backend API requests
- Separate development and production environments
- Vite hot reload for frontend development

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Development Server | Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Web Server | Nginx |
| Containerization | Docker, Docker Compose |
| Version Control | Git, GitHub |

## 📁 Project Structure

```text
Todo-Docker-Application/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── models/
│       └── Todo.js
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       └── App.css
├── docker-compose.yml
└── README.md
```

## 🏗️ Application Architecture

```text
             React Frontend
                    |
          Development / Production
                    |
             Nginx (Production)
                    |
               API Requests
                    |
           Node.js + Express
                    |
                 MongoDB
                    |
            Persistent Volume
```

- **Frontend:** React application for managing Todo tasks.
- **Backend:** Express REST API handles CRUD operations.
- **Database:** MongoDB stores Todo records.
- **Nginx:** Serves the production frontend and proxies `/api/` requests to the backend.
- **Docker Compose:** Runs and connects the application services.

## ⚙️ Prerequisites

Install the following before running the application:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/Priyankakadam136/todo-docker-app.git
cd Todo-Docker-Application
```

### 1. Development Mode – Vite Hot Reload

Start the development environment:

```bash
docker compose --profile dev up -d
```

Open the application:

**http://localhost:5173**

Vite provides Hot Module Replacement (HMR), automatically updating frontend changes when you save your React or CSS files.

No frontend Docker image rebuild is required for normal code changes.

### 2. Production Mode – Docker and Nginx

Start the production environment:

```bash
docker compose up -d --build
```

Open the application:

**http://localhost:8080**

In production mode:
- React is built into static files.
- Nginx serves the frontend.
- Nginx forwards API requests to the backend.
- MongoDB stores application data.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Retrieve all tasks |
| POST | `/api/todos` | Create a task |
| PUT | `/api/todos/:id` | Update task status |
| DELETE | `/api/todos/:id` | Delete a task |

## 🐳 Docker Commands

Check running containers:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f
```

Stop containers:

```bash
docker compose down
```

Rebuild the production frontend:

```bash
docker compose up -d --build frontend
```

Rebuild the backend:

```bash
docker compose up -d --build backend
```

**Important:** MongoDB data is stored in a named Docker volume. Running `docker compose down` preserves this data. Avoid `docker compose down -v` unless you intentionally want to delete the database volume and its contents.

## 💾 Data Persistence

MongoDB uses a named Docker volume:

```yaml
volumes:
  - mongo-data:/data/db
```

This allows Todo records to persist even when containers are stopped and restarted.

## 🎯 What This Project Demonstrates

- Building a full-stack application with React and Node.js.
- Creating and managing Docker containers.
- Orchestrating multiple services using Docker Compose.
- Connecting frontend, backend, and database containers.
- Configuring Nginx as a reverse proxy.
- Implementing persistent database storage.
- Using Vite for faster frontend development with hot reload.
- Running separate development and production environments.
