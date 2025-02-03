import React, { useState, useEffect } from "react";
import axios from "axios";

export const TodoForm = () => {
  // State to manage and stores the todos, form data, and error messages
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({
    date: "",
    day: "",
    activity: "",
    status: "Not Done",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the todos from the API
    axios
      .get("http://localhost:4000/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => {
        console.error("Error fetching todos:", err);
        setError("Failed to fetch todos.");
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled in
    if (!form.date || !form.day || !form.activity) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Send POST request to create a new todo
      const res = await axios.post("http://localhost:4000/todos", form);

      if (res.status === 201) {
        setTodos([...todos, res.data]); // Append the new todo to the list
        setForm({ date: "", day: "", activity: "", status: "Not Done" });
        setError(""); // Clear any error messages
      } else {
        setError("Failed to save the task.");
      }
    } catch (err) {
      console.error("Error saving todo:", err);
      setError("Failed to save the task.");
    }
  };

  // Function to delete a todo by its ID
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id)); // Remove the todo from the list
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete the task.");
    }
  };

  return (
    <div className="todo-app">
      <h1>Personal Planner</h1>

      {/* Todo Form */}
      <form onSubmit={handleSubmit} className="todo-form">
        {error && <p className="error">{error}</p>}

        {/* Date input */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="todo-input"
          required
        />

        {/* Day input */}
        <input
          type="text"
          name="day"
          value={form.day}
          onChange={handleChange}
          className="todo-input"
          placeholder="Enter Day"
          required
        />

        {/* Activity input */}
        <input
          type="text"
          name="activity"
          value={form.activity}
          onChange={handleChange}
          className="todo-input"
          placeholder="What is the task?"
          required
        />

        {/* Status dropdown */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="todo-input"
        >
          <option value="Not Done">Not Done</option>
          <option value="Done">Done</option>
        </select>

        {/* Submit button */}
        <button type="submit" className="todo-btn">
          Add Task
        </button>
      </form>

      {/* Todo List */}
      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <p>
              <strong>Date:</strong> {todo.date}
            </p>
            <p>
              <strong>Day:</strong> {todo.day}
            </p>
            <p>
              <strong>Activity:</strong> {todo.activity}
            </p>
            <p>
              <strong>Status:</strong> {todo.status}
            </p>

            {/* Delete button */}
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
