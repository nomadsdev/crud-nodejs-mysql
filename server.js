const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const serverrun = `Server is running ${PORT}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

// index page select all employees

app.get('/', (req, res) => {
    const sqlAll = `SELECT * FROM employees`;
    db.query(sqlAll, (err, Dataresult) => {
        if (err) throw err;
        res.render('index', { employees: Dataresult });
    })
});

// add data

app.post('/add', (req, res) => {
    const { firstName, lastName, phoneNumber, job, salary } = req.body;
    const sqlinsert = `INSERT INTO employees (first_name, last_name, phone_number, job, salary) VALUES (?, ?, ?, ?, ?)`;
    db.query(sqlinsert, [firstName, lastName, phoneNumber, job, salary], (err, result) => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    });
});

// delete data

app.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sqldelete = `DELETE FROM employees WHERE id = ?`;
    db.query(sqldelete, id, (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
});

// page edit get data

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = `SELECT * FROM employees WHERE id = ?`;
    db.query(sqlSelect, id, (err, result) => {
      if (err) throw err;
      res.render('edit', { employee: result[0] });
    });
});

// update data from

app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, phoneNumber, job, salary } = req.body;
    const sqlUpdate = `UPDATE employees SET first_name = ?, last_name = ?, phone_number = ?, job = ?, salary = ? WHERE id = ?`;
    db.query(sqlUpdate, [firstName, lastName, phoneNumber, job, salary, id], (err, result) => {
      if (err) {
        throw err;
      }
      console.log(`Employee with ID ${id} has been updated.`);
      res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(serverrun);
});