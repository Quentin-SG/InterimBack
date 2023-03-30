import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

export const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    port: process.env.MYSQL_ADDON_PORT,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
}).promise();