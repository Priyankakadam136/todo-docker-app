
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const API_URL = "/api/todos";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching todos:", err))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo.trim() }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const data = await res.json();
      setTodos((prev) => [data, ...prev]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      const data = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? data : todo))
      );
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const totalTasks = todos.length;
  const completedTasks = todos.filter((todo) => todo.completed).length;
  const activeTasks = totalTasks - completedTasks;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <main className="app">
      <div className="dashboard">
        <header className="topbar">
          <a className="brand" href="/">
            <span className="brand-icon">✓</span>
            <span>TaskFlow</span>
          </a>
          <span className="topbar-label">MY WORKSPACE</span>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PERSONAL TASK MANAGER</p>
            <h1>Stay focused.<br />Get things done.</h1>
            <p className="subtitle">
              Organize your day, track your progress and make every task count.
            </p>
          </div>
          <div className="welcome-art" aria-hidden="true">✦</div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span className="stat-icon purple">▤</span>
            <div>
              <p>Total tasks</p>
              <h2>{totalTasks}</h2>
            </div>
          </article>

          <article className="stat-card">
            <span className="stat-icon orange">◷</span>
            <div>
              <p>Pending</p>
              <h2>{activeTasks}</h2>
            </div>
          </article>

          <article className="stat-card">
            <span className="stat-icon green">✓</span>
            <div>
              <p>Completed</p>
              <h2>{completedTasks}</h2>
            </div>
          </article>
        </section>

        <section className="task-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR CHECKLIST</p>
              <h2>My Tasks</h2>
            </div>
            <span className="task-count">{totalTasks} tasks</span>
          </div>

          <div className="add-task">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              placeholder="What needs to be done?"
              aria-label="New task"
            />
            <button onClick={addTodo} disabled={!newTodo.trim()}>
              <span>＋</span> Add Task
            </button>
          </div>

          <div className="filters">
            {["all", "active", "completed"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter active-filter" : "filter"}
                onClick={() => setFilter(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <div className="todo-list">
            {loading ? (
              <p className="empty-state">Loading your tasks...</p>
            ) : filteredTodos.length === 0 ? (
              <div className="empty-state">
                <span>✧</span>
                <h3>
                  {filter === "completed"
                    ? "No completed tasks yet"
                    : filter === "active"
                    ? "You're all caught up!"
                    : "Your task list is empty"}
                </h3>
                <p>Add a task above to get started.</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <article className="todo-item" key={todo._id}>
                  <label className="todo-check">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id, todo.completed)}
                    />
                    <span className="custom-check"></span>
                  </label>

                  <span
                    className={
                      todo.completed ? "todo-title completed-title" : "todo-title"
                    }
                  >
                    {todo.title}
                  </span>

                  <span className={todo.completed ? "status done" : "status pending"}>
                    {todo.completed ? "Completed" : "In progress"}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() => deleteTodo(todo._id)}
                    aria-label={`Delete ${todo.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="footer">
          Made to help you stay organized.
        </footer>
      </div>
    </main>
  );
}

export default App;
