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

router.get( "/search", async (req, res) => {
    const offers = (await pool.query(`select id, nom, id_utilisateurPayant, views from offre where nom like ?;`, ['%' + req.query.name + '%']))[0];
    if( offers ) res.status(200).send( offers );
    else res.status(204).send();
});

router.get( "/", async (req, res) => {
    const id = req.query.id;
    const offer = (await pool.query(`select id, nom, id_utilisateurPayant, views from offre where id = ?;`, [id]))[0][0];
    if( offer ){
        await pool.query(`update offre set views = views + 1 where id = ?;`, [ id ]);
        res.status(200).send( [offer] );
    } 
    else res.status(204).send();
});

export default router;