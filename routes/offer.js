import express from "express";
import { pool } from "../database.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post( "/create", async (req, res) => {
    const id = uuidv4();
    const name = req.body.name;
    const id_user = req.body.id_user;
    const views = 0;
    if( (await pool.query(`insert into offre values (?,?,?,?);`, [ id, name, id_user, views ]))[0].affectedRows ){
        res.status(201).send([{message:"Successfully created", id}]);
    }
});

export default router;