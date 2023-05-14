import express from "express";
import { pool } from "../database.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post( "/create", async (req, res) => {
    const id = uuidv4();
    const id_user = req.body.id_user;
    const dataJSON = req.body.data;
    if( (await pool.query(`insert into notification values (?,?,?);`, [ id, id_user, dataJSON ]))[0].affectedRows ){
        res.status(201).send([{message:"Successfully created", id}]);
    }
});

router.get( "/", async (req, res) => {
    const notification = (await pool.query(`select * from notification where id = ?;`, [req.query.id]))[0][0];
    if( notification ) res.status(200).send( notification );
    else res.status(204).send();
});

export default router;