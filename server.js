import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

const app = express();

const PORT = 5000;

app.listen( PORT, () => {
    console.log("Server started and listening on port " + PORT);
});

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    port: process.env.MYSQL_ADDON_PORT,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
}).promise();


app.get("/user", async (req, res) => {

    const email = req.query.email;
    const rows = await pool.query(`select mdp, salt from utilisateur where email = ?;`, [email]);
    res.status(201).send(rows[0]);

});





