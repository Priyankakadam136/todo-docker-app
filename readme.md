# 🚀 Dockerized Todo App - Complete Guide

This guide provides a complete step-by-step setup for creating a **Dockerized Todo App** with a **Vite + React frontend**, **Node.js + Express backend**, **MongoDB** with persistent volume, and **Nginx** as a reverse proxy. Follow along to build, run, and test your full-stack application.

---

## 1️⃣ Project Structure

```
todo-app/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── models/Todo.js
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/App.jsx
└── docker-compose.yml
```

---

## 2️⃣ Backend Setup

### `backend/package.json`

```json
{
  "name": "todo-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mongoose": "^7.3.1"
  }
}
```

### `backend/models/Todo.js`

```js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

export default mongoose.model("Todo", todoSchema);
```

### `backend/server.js`

```js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Todo from "./models/Todo.js";

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/todos";

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("✅ Backend running. Use /api/todos"));

// CRUD Endpoints
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ _id: -1 });
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const { title } = req.body;
  const todo = new Todo({ title });
  await todo.save();
  res.json(todo);
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
  res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted" });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
```

### `backend/Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 3️⃣ Frontend Setup

Use Vite to create the React frontend.

### `frontend/package.json`

```json
{
  "name": "todo-frontend",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  }
}
```

### `frontend/vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
```

### `frontend/src/App.jsx`

```jsx
import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const API_URL = "/api/todos";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo })
    });
    const data = await res.json();
    setTodos([data, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = async (id, completed) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });
    const data = await res.json();
    setTodos(todos.map(t => t._id === id ? data : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h1>📝 Todo App</h1>
      <div>
        <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Enter a task..." />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span onClick={() => toggleTodo(todo._id, todo.completed)} style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}>{todo.title}</span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### `frontend/nginx.conf`

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html index.htm;

    location /api/ {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

### `frontend/Dockerfile`

```dockerfile
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4️⃣ Docker Compose Configuration

### `docker-compose.yml`

```yaml
version: "3.9"
services:
  frontend:
    build: ./frontend
    container_name: todo-frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - todo-net

  backend:
    build: ./backend
    container_name: todo-backend
    environment:
      - MONGO_URI=mongodb://mongo:27017/todos
    depends_on:
      - mongo
    networks:
      - todo-net

  mongo:
    image: mongo:6
    container_name: todo-mongo
    volumes:
      - mongo-data:/data/db
    networks:
      - todo-net

volumes:
  mongo-data:

networks:
  todo-net:
```

---

## 5️⃣ Running the Application

```bash
docker compose down -v
docker compose up --build
```

- **Frontend:** [http://localhost:8080](http://localhost:8080)
- **Backend API via Nginx proxy:** [http://localhost:8080/api/todos](http://localhost:8080/api/todos)
- **MongoDB:** Data persists in the `mongo-data` volume
---

This guide provides a polished, complete setup for a Dockerized Todo App, including **folder structure, Dockerfiles, Nginx proxy configuration, backend and frontend code, and Docker Compose orchestration**.

