const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const pool = require('./db');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// index page
app.get("/", async (req, res) => {
    try {
        const todos = await pool.query("SELECT * FROM todo");
        res.render("index", {todos: todos.rows });
    } catch (error) {
        console.error(`error: ${error.message}`);
    }
});


// add todo
app.post("/", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *", [description]
        );
        res.redirect('/');
    } catch (error) {
        console.error(`error: ${error.message}`);
    } 
});

// edit page
app.get("/:id/edit", async (req, res) => {
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [req.params.id]);
        res.render("edit", {todo: todo.rows[0]});
    } catch (error) {
        console.error(`edit error: ${error.message}`);
    }
});

// edit todo 
app.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]
        );
        console.log(updateTodo);
    } catch (error) {
        console.error(`error: ${error.message}`);
    }
});

app.delete("/:id", async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM todo WHERE todo_id = $1", [req.params.id] 
        );
        res.redirect('/');
    } catch (error) {
        console.error(`delete error: ${error.message}`);
    }
})


app.listen(3000, () => {
    console.log("connected to post 3000");
});