const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;
const cors = require("cors");

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// create database
const db = new sqlite3.Database("./database/quotes.db", (err) => {
    if (err) {
        console.error("Database error:", err);
    } else {
        console.log("Database connected");
    }
});

// create tables and insert data sequentially
db.serialize(() => {
    // create quotes table
    db.run(`
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            origin TEXT,
            destination TEXT,
            cargo TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // create shipments table
    db.run(`
        CREATE TABLE IF NOT EXISTS shipments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_id TEXT UNIQUE,
            status TEXT,
            current_location TEXT,
            destination TEXT,
            estimated_delivery TEXT
        )
    `);

    // insert sample shipment (TEMPORARY)
    db.run(`
        INSERT OR IGNORE INTO shipments
        (tracking_id, status, current_location, destination, estimated_delivery)
        VALUES
        ('SY123456789', 'In Transit', 'Mumbai, India', 'Chennai, India', '20 Feb 2026')
    `);
});

// handle form submit
app.post("/submit-quote", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const origin = req.body.origin;
    const destination = req.body.destination;
    const cargo = req.body.cargo;

    db.run(
        "INSERT INTO quotes (name, email, origin, destination, cargo) VALUES (?, ?, ?, ?, ?)",
        [name, email, origin, destination, cargo],
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send("Error saving quote");
            } else {
                res.send(`
                    <h2>Quote submitted successfully</h2>
                    <a href="/quote.html">Back</a>
                `);
            }
        }
    );
});

// get shipment by tracking id
app.get("/track/:trackingId", (req, res) => {

    const trackingId = req.params.trackingId;

    db.get(
        "SELECT * FROM shipments WHERE tracking_id = ?",
        [trackingId],
        (err, row) => {

            if (err) {
                res.json({ error: "Database error" });
            } else if (!row) {
                res.json({ error: "Tracking ID not found" });
            } else {
                res.json(row);
            }
        }
    );

});

// start server
app.listen(PORT, () => {
    console.log("Server running at http://localhost:3000");
});
