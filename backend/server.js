import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Todo from "./models/Todo.js";

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todos";

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/", (req, res) => {
  res.send("✅ Backend running. Use /api/todos");
});

// Get todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ _id: -1 });
  res.json(todos);
});

// Add todo
app.post("/api/todos", async (req, res) => {
  const { title } = req.body;
  const todo = new Todo({ title });
  await todo.save();
  res.json(todo);
});

// Update todo
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
  res.json(todo);
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted" });
});

// Start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
