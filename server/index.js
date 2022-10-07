const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3002;
const session = require('express-session');
const app = express();
var mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
const https = require('https');
const fs = require('fs');

/**
 * Prevent issues with sending requests
*/

app.use(cors({
    origin: ["http://localhost:3000", "https://stormdamagemap.com", "https://www.stormdamagemap.com"],
    method: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

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
    let sql = 'SELECT * FROM markers WHERE date >= ' + mysql.escape(req.query.dateStart) + ' AND date <= ' + mysql.escape(req.query.dateEnd) + ' AND IF(code IS NULL, "", code) LIKE ' + mysql.escape("%" + req.query.code + "%") + ' AND lat LIKE ' + mysql.escape("%" + req.query.lat + "%") + ' AND lng LIKE ' + mysql.escape("%" + req.query.lng + "%") + ' AND IF(address IS NULL, "", address) LIKE ' + mysql.escape("%" + req.query.address + "%") + ' AND complete = ' + mysql.escape(req.query.status) + ' ORDER BY date DESC';
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
 * Insert code into database
*/
app.post("/code", (req, res) => {
    let data = { code: req.body.code, password: req.body.password };

    let sql = 'INSERT INTO codes SET ?';
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.json({ 'success': true, 'response': results });
    });
});

/**
 * Check if code exists
*/
app.get("/checkcode", (req, res) => {
    let sql = 'SELECT * FROM codes WHERE code = ' + mysql.escape(req.query.code) + '';
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ 'success': true, 'result': true });
        } else {
            res.json({ 'success': true, 'result': false });
        }
    });
});

/**
 * Toggle marker
*/
app.post("/togglemarker", (req, res) => {
    let sql = 'UPDATE markers, codes SET markers.complete = IF(markers.complete = 0, 1, 0) WHERE codes.code = ' + mysql.escape(req.body.code) + ' AND codes.password = ' + mysql.escape(req.body.password) + ' AND markers.id = ' + mysql.escape(req.body.id) + '';
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ 'success': true, 'result': true });
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

if (process.env.SANDBOX == 0) {
    /**
     * Encrypt
     */

    const privateKey = fs.readFileSync('/etc/letsencrypt/live/stormdamagemap.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/stormdamagemap.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/stormdamagemap.com/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(8442, () => {
        console.log('HTTPS Server running on port 8442');
    });
}