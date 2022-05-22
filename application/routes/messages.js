/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: messages.js
 * Description: this file handles messages that can be passed between the tutuor and their client.
 */

var db = require('../config/Database');
var express = require('express');
const MessageError = require('../helpers/error/MessageError');
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var router = express.Router()

/**adds messages */
router.post('/add', async (req, res, next) => {
    try {
        let message = req.body.message;
        let from_username = req.session.username;
        let to_username = req.body.to_username;
        // console.log(req.body);
        // console.log(message + " " + from_username + " " + to_username);
        let baseSQL = 'INSERT INTO Messages (Message, Created_At, Seen, From_Username, To_Username) VALUES (?,now(),false,?,?)'
        const [results, fields] = await db.execute(baseSQL, [message, from_username, to_username])
        if (results && results.affectedRows) {
            successPrint("messages.js --> Message is added");
            req.flash('success', 'Message has been sent');
            res.redirect('/')
        } else {
            throw new MessageError(
                "Server Error, Message could not be sent",
                "/inbox",
                200
            );
        }
    } catch (err) {
        errorPrint("Message couldn't be sent", err);
        if (err instanceof MessageError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }
    }
})
/**gets messages */
router.get('/get', async (req, res, next) => {
    try {
        let username = req.session.username;
        let sqlReadyUsername = "'" + username + "'";
        // console.log(username);
        // console.log(sqlReadyUsername);
        const [results, fields] = await db.execute(`SELECT * FROM Messages where To_Username = ${sqlReadyUsername} ORDER BY Id DESC LIMIT 40`)
        successPrint("messages.js --> Messages fetched");
        return res.status(200).send(results)
    } catch (err) {
        errorPrint("Messages couldn't be fetched", err);
        if (err instanceof MessageError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }
    }
})
router.get('/read/:id', async (req, res, next) => {
    try {
        if (req.params.id) {
            await db.execute(`UPDATE Messages SET Seen = ${true} WHERE Id=${req.params.id}`)
        }
        return res.status(200).send({ message: "Message seen successfully" })
    } catch (err) {
        errorPrint("Message couldn't be seen", err);
        if (err instanceof MessageError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }
    }
})

/**deletes messages */
router.get('/delete/:id', async (req, res, next) => {
    console.log(req.params.id);
    try {
        if (req.params.id) {
            await db.execute(`DELETE FROM Messages WHERE id=${req.params.id};`)
            res.redirect('/inbox');
        }

        return res.status(200).send({ message: "Message deleted successfully" })
    } catch (err) {
        errorPrint("Message couldn't be deleted", err);
        if (err instanceof MessageError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }
    }
})
module.exports = router
