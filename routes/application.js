import express from "express";
import { pool } from "../database.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post( "/create", async (req, res) => {

    if( !(await pool.query(`select count(*) as count from candidature where id_DemandeurEmploi = ? and id_offre = ?;`, [req.body.id_user, req.body.id_offre]))[0][0].count ){
        const user = (await pool.query(`select * from utilisateur where id = ?;`, [req.body.id_user]))[0][0];
        if( user?.userRole == "1" ){
            const detailedUser = (await pool.query(`select * from demandeurEmploi where id_utilisateur = ?;`, [req.body.id_user]))[0][0];
    
            const id = uuidv4();
            const nom = detailedUser.nom;
            const prenom = detailedUser.prenom;
            const dateNaiss = detailedUser.dateNaiss;
            const nationnalite = detailedUser.nationnalite;
            const cv = "";
            const statut = 0;
            const lettre = "";
            const id_DemandeurEmploi = detailedUser.id_utilisateur;
            const id_offre = req.body.id_offre;
    
            console.log(user)
    
            if( (await pool.query(`insert into candidature values (?,?,?,?,?,?,?,?,?,?);`, [ id, nom, prenom, dateNaiss, nationnalite, cv, statut, lettre, id_DemandeurEmploi, id_offre ]))[0].affectedRows ){
                res.status(201).send([{message:"Successfully created", id}]);
            }
        }
    
    }else res.status(401).send([{message:"Can't apply at the same offer twice."}]);

});

router.get( "/", async (req, res) => {
    const application = (await pool.query(`select * from candidature where id = ?;`, [req.query.id]))[0][0];
    if( application ) res.status(200).send( [application] );
    else res.status(204).send();
});


export default router;