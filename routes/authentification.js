import express from "express";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { pool } from "../database.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post('/login', async ( req, res ) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = (await pool.query(`select id, mdp, salt from utilisateur where email = ?;`, [email]))[0][0];

    if( user ){

        const hashedBuffer = scryptSync( password, user.salt, 64 );
        const keyBuffer = Buffer.from( user.mdp, "hex" );

        if( timingSafeEqual( hashedBuffer, keyBuffer ) ) res.status(200).send({message:"Succesfully connected", id:user.id});
        else res.status(401).send({message:"Wrong password"});
        
    }else res.status(401).send({message:"Wrong email"});

});

router.post("/signup", async ( req, res ) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const NumberSameUsername = (await pool.query(`select count(id) as number from utilisateur where username = ?;`, [username]))[0][0].number;
    const NumberSameEmail = (await pool.query(`select count(id) as number from utilisateur where email = ?;`, [email]))[0][0].number;

    if( NumberSameUsername ) res.status(409).send({message:"User name is already in use"});
    else if( NumberSameEmail ) res.status(409).send({message:"Email Adress is already in use"});
    else {
        const salt = randomBytes(16).toString("hex");
        const hashedPassword = scryptSync( password, salt, 64 ).toString("hex");
        const id = uuidv4();
    
        if( (await pool.query(`insert into utilisateur values (?,?,?,?,?,?,?,?);`, [ id, username, email, hashedPassword, salt, false, false, 0 ]))[0].affectedRows ){
            res.status(201).send({message:"Successfully registered", id});
        }
    }
    
});

router.post("/signup-jobseeker", async ( req, res ) => {
    const userId = req.body.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const birthday = req.body.birthday;
    const city = req.body.city;
    const nationality  = req.body.nationality;

    const user = (await pool.query(`select id from utilisateur where id = ?;`, [userId]))[0][0];

    if( user ){
        if( (await pool.query(`insert into demandeurEmploi values (?,?,?,?,?,?);`, [ userId, firstname, lastname, birthday, city, nationality]))[0].affectedRows ){
            await pool.query(`update utilisateur set userRole = 1 where id = ?;`, [ userId ]);
            res.status(201).send({message:"Successfully registered", userId});
        }
    }
    
});



export default router;
