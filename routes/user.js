import express from "express";
import { pool } from "../database.js";

const router = express.Router();

router.get( "/", async (req, res) => {
    const user = (await pool.query(`select id, username, userRole from utilisateur where id = ?;`, [req.query.id]))[0][0];
    if( user ) res.status(200).send( user );
    else res.status(204).send();
});

router.get( "/search", async (req, res) => {
    const user = (await pool.query(`select id, username, userRole from utilisateur where username like ?;`, ['%' + req.query.username + '%']))[0];
    if( user ) res.status(200).send( user );
    else res.status(204).send();
});

export default router;