const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES

// create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error("Error creating todo:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error("Error fetching todos:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);

    res.json(todo.rows[0]);
  } catch (error) {
    console.error("Error fetching todo:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json("todo was updated");
  } catch (error) {
    console.error("Error updating todo:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

    res.json("todo was deleted");
  } catch (error) {
    console.error("Error deleting a todo:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
