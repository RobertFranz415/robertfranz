/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: posts.js
 * Description: this file handles the upload for tutor listings.
 */

var express = require("express");
var router = express.Router();
const PostError = require("../helpers/error/PostError");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var db = require('../config/Database');
const multer = require('multer');
const sharp = require('sharp');
const { response } = require("../app");
const path = require('path')

var storage = multer.diskStorage({
    //tells multer where to find the file once its uploaded
    destination: function (req, file, cb) { //cb = callback
        //doesnt work when removing FrontEnd
        cb(null, "FrontEnd/Assets/uploads/");
    },
    //tells multer how to name the file
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname)) //Date + original filename 
    }
});

//creates new multer object with storage obj and its configurations (storage)
const uploader = multer({ storage: storage });

router.post('/BecomeTutor', uploader.single('uploadImage'), (req, res, next) => {
    console.log("TEST FROM INSIDE POST ROUTE");
    let fileUploaded = req.file.path; //path to the file
    let fileAsThumbnail = `tl-${req.file.filename}`; //makes the thumbnail filename
    let destOfThumbnail = req.file.destination + fileAsThumbnail; //file.destination is the path then adding the thumbnail filename after

    //Listing Table
    let listingTittle = req.body.listingTittle;
    let listingPrice = req.body.listingPrice;
    let listingDescription = req.body.listingDescription;
    let listingCategory = req.body.listingCategory;//
    let listingAvailability = req.body.listingAvailability;
    let listingName = req.body.listingName;
    let sessionUserId = req.session.userid;
    let sessionUsername = req.session.username;

    //creating thumbnail
    sharp(fileUploaded)
        .resize(400) //one # for 200x200
        .toFile(destOfThumbnail) //send file to specified path
        .then(() => {
            //Inserting data into Listing db table
            let baseSQL = `INSERT INTO Listing (ListingTittle, ListingDescription, ListingCategory, ListingPrice, UserListing, created, ApprovalStatus, Thumbnail, Availability, Name) 
            VALUES (?, ?, ?, ?, ?, now(), 0, ?, ?, ?);`
            return db.execute(baseSQL, [listingTittle, listingDescription, listingCategory, listingPrice, sessionUserId, fileAsThumbnail, listingAvailability, listingName]);
        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) { //if there is an affected row this means that the post was added to the table
                console.log("Tutor information posted")
                res.redirect('/');
            } else {
                next(Error('post was not created'));
            }
        })
        .catch((err) => { next(err) });
});

module.exports = router;
