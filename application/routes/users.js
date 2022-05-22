/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: users.js
 * Description: this file handles registration, login, sessions,
 * and encryption for the users.
 */

var express = require('express');
var router = express.Router();
const UserError = require("../helpers/error/UserError");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var db = require('../config/Database');

/**variables for encryption*/
var bcrypt = require('bcrypt');

/**function below handles the functinality for registering a new user. */
router.post('/register', (req, res, next) => {
    
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.cpassword;

    db.execute("SELECT * FROM User WHERE UserName=?", [username])
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return db.execute("SELECT * FROM User WHERE Email=?", [email]);
            } else {
                throw new UserError(
                    "Registration Failed: Username already exists",
                    "/register",
                    200
                );
            }
        })
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return bcrypt.hash(password, 15);
            } else {
                throw new UserError(
                    "Registration Failed: Email already exists",
                    "/register",
                    200
                );
            }
        })
        /**encryption code. This should result in when you register
         * a new user there should be a slight delay and in the database
         * it will show that the password that the user has created will be hashed.
        */
        .then((hashedPassword) => {

            let baseSQL = "INSERT INTO User (UserName, UserRating, UserType, Email, password, DateCreated) VALUES (?,0,2,?,?, now());";
            return db.execute(baseSQL, [username, email, hashedPassword])

        })
        /**encryption code end*/
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                successPrint("User.js --> User was created");
                req.flash('success', 'User account has been created');
                res.redirect('/login');
            } else {
                throw new UserError(
                    "Server Error, user could not be created",
                    "/register",
                    500
                );
            }
        })
        .catch((err) => {
            errorPrint("User could not be made", err);
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        });
});

/**function below handles the functinality for logging in. */
router.post('/login', (req, res, next) => {
    
    let username = req.body.username;
    let password = req.body.password;

    let baseSQL = "SELECT userid,username, password FROM User WHERE UserName=?;"
    let userid;

    db.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                let hashedPassword = results[0].password;
                userid = results[0].userid;
                return bcrypt.compare(password, hashedPassword );
            } else {
                throw new UserError("invalid username and/or password", "/login", 200);
            }
        })
        .then((passwordsMatched) =>{
            if(passwordsMatched){
                successPrint(`User ${username} is logged in`);
                req.session.username = username;
                req.session.userid = userid;
                res.locals.logged = true;
                req.flash('success', 'You have been logged in');
                res.redirect('/');
            } else {
                throw new UserError("Invalid username and/or password", "/login", 200);
            }
        })
        .catch((err) => {
            errorPrint("user login failed");
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect('/login');
            } else {
                next(err);
            }
        })
});

/**function below handles the functinality for logging out. */
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint('Session could not be destroyed');
            next(err);
        } else {
            successPrint('Session destroyed');
            res.clearCookie('csid');
            res.json({ status: "OK", message: "User was logged out" });
        }
    })
});

module.exports = router;