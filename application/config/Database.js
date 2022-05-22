/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: Database.js
 * Description: this file handles the connection to our database.
 */

const mysql = require('mysql2');

const pool = mysql.createPool({
    host:"aa1mwefwhxst1sy.cmgy4wwboxcp.us-east-2.rds.amazonaws.com",
    user:"teamfive",
    password:"teamfive",
    connectionLimit: 100,
    database: "TutorHub",
    waitForConnections: true,
    debug: false,
});

const myPromise = pool.promise();
module.exports = myPromise;