import express from "express";
import { pool } from "../database.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post( "/create", async (req, res) => {
    const {userRole} = (await pool.query(`select userRole from utilisateur where id = ?;`, [req.body.id_user]))[0][0];
    if( userRole == "2" ){
        const id = uuidv4();
        const name = req.body.name;
        const id_user = req.body.id_user;
        const views = 0;

        if( (await pool.query(`insert into offre values (?,?,?,?);`, [ id, name, id_user, views ]))[0].affectedRows ){
            const metier = req.body.metier;
            const dateDeb = req.body.dateDeb;
            const dateFin = req.body.dateFin;
            const description = "";
            const remuneration = req.body.remuneration;
            if( (await pool.query(`insert into offreEmployeur values (?,?,?,?,?,?);`, [ id, metier, dateDeb, dateFin, description, remuneration ]))[0].affectedRows ){
                res.status(201).send([{message:"Successfully created", id}]);
            }
        }
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
        const {userRole} = (await pool.query(`select userRole from utilisateur where id = ?;`, [offer.id_utilisateurPayant]))[0][0];
        const detailedOffer = userRole == "2" ? (await pool.query(`select * from offreEmployeur where id_offre = ?;`, [offer.id]))[0][0] : (await pool.query(`select * from offreAgence where id_offre = ?;`, [offer.id]))[0][0];
        await pool.query(`update offre set views = views + 1 where id = ?;`, [ id ]);
        res.status(200).send( [detailedOffer] );
    } 
    else res.status(204).send();
});

router.get( "/popular", async (req, res) => {
    const offers = (await pool.query(`select id, nom, id_utilisateurPayant, views from offre order by views DESC LIMIT 5;`, []))[0];
    if( offers ) res.status(200).send( offers );
    else res.status(204).send();
});

export default router;