const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const app = express();
var mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
var nodemailer = require('nodemailer');

/**
 * Prevent issues with sending requests
*/

app.use(cors({
    origin: ["http://localhost:3000"],
    method: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Set up session
*/

app.use(session({
    key: "userID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}));

app.use(cookieParser());

/**
 * Connect to mail server
 */

var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Connect to MySQL server
*/

const conn = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: process.env.DB_PORT
});

// Connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected!');
});

/**
 * Get icons that can be used
*/
app.get("/geticons", (req, res) => {
    let sql = 'SELECT * FROM icons';
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ 'success': true, 'result': results });
        } else {
            res.json({ 'success': true, 'result': false });
        }
    });
});

/**
 * Gets markers for map
*/
app.get("/markers", (req, res) => {
    let sql = 'SELECT * FROM markers WHERE date >= DATE_SUB(now(),INTERVAL 2 WEEK)';
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ 'success': true, 'result': results });
        } else {
            res.json({ 'success': true, 'result': false });
        }
    });
});

/**
 * Gets specific marker from map
*/
app.get("/marker", (req, res) => {
    let sql = 'SELECT * FROM markers WHERE id = ' + mysql.escape(req.query.id) + '';
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ 'success': true, 'result': results });
        } else {
            res.json({ 'success': true, 'result': false });
        }
    });
});

/**
 * Insert marker into database
*/
app.post("/marker", (req, res) => {
    let data = { date: req.body.date, damageName: req.body.damageName, code: req.body.code, image: req.body.image, comments: req.body.comments, lat: req.body.lat, lng: req.body.lng, address: req.body.address };

    let sql = 'INSERT INTO markers SET ?';
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.json({ 'success': true, 'response': results });
    });
});

/**
 * Gets specific marker from map
*/
app.get("/search", (req, res) => {
    let sql = 'SELECT * FROM markers WHERE date >= ' + mysql.escape(req.query.dateStart) + ' AND date <= ' + mysql.escape(req.query.dateEnd) + ' AND IF(code IS NULL, "", code) LIKE ' + mysql.escape("%" + req.query.code + "%") + ' AND lat LIKE ' + mysql.escape("%" + req.query.lat + "%") + ' AND lng LIKE ' + mysql.escape("%" + req.query.lng + "%") + ' AND IF(address IS NULL, "", address) LIKE ' + mysql.escape("%" + req.query.address + "%") + ' ORDER BY date DESC';
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ 'success': true, 'result': results });
        } else {
            res.json({ 'success': true, 'result': false });
        }
    });
});

/**
 * Start listening on server, print information to screen
*/
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});