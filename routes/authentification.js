import express from "express";
import { scryptSync, timingSafeEqual } from "crypto";
import { pool } from "../database.js";

const router = express.Router();

router.post('/login', async ( req, res ) => {
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

export default router;
