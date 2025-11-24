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

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error("Error fetching todos:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    // Check if description is present before trying to query the DB
    if (!description) {
      // Return a 400 Bad Request if data is missing
      return res.status(400).json({ error: "Description is required." });
    }

    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    // 201 Created is the standard status for successful creation
    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    // 1. Crucial Fix: Send an error response back to the client (e.g., 500 Internal Server Error)
    console.error("Error creating todo:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// get all todos

// get a todo

// update a todo

// delete a todo

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
