import express from "express";
import bodyParser from "body-parser"
import dotenv from "dotenv";
import mysql from "mysql2";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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


app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = (await pool.query(`select id, mdp, salt from utilisateur where email = ?;`, [email]))[0][0];

    if( user ){

        const hashedBuffer = scryptSync( password, user.salt, 64 );
        const keyBuffer = Buffer.from( user.mdp, "hex" );

        if( timingSafeEqual( hashedBuffer, keyBuffer ) ) res.status(200).send("Succesfully connected");
        else res.status(401).send("Wrong password");
        
    }else res.status(401).send("Wrong email");

});


