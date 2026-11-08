import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const API_URL = "/api/todos";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("❌ Error fetching todos:", err));
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await res.json();
      setTodos([data, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error("❌ Error adding todo:", err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      const data = await res.json();
      setTodos(todos.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error("❌ Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Error deleting todo:", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h1>📝 Todo App</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a task..."
          style={{ padding: "8px", width: "70%" }}
        />
        <button
          onClick={addTodo}
          style={{ padding: "8px 16px", marginLeft: "8px" }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: todo.completed ? "#d3ffd3" : "#fff",
            }}
          >
            <span
              onClick={() => toggleTodo(todo._id, todo.completed)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
                flex: 1,
                textAlign: "left",
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              style={{
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
