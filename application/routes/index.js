/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: index.js
 * Description:
 */

var express = require('express');
var router = express.Router();

//for testing only
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
var db = require('../config/Database');

router.get('/', (req, res, next) => {
    res.render('index', {title:"Tutor Hub", username:req.session.username});
});

router.get('/login', (req, res, next) => {
    res.render('Login', {title:"Log In", username:req.session.username});
});

router.get('/register', (req, res, next) => {
    res.render('Registration', {title: "Register", username:req.session.username});
});

router.get('/BecomeTutor', (req, res, next) => {
    res.render('BecomeTutor', {title: "Become A Tutor", username:req.session.username});
});

router.get('/Profile/:id', (req, res, next) => {
    let profileName = req.params.id;
    console.log(req.params);

    let baseSQL = `select distinct u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, \
    l.ListingDescription, l.ListingPrice, l.ListingCategory, l.Thumbnail, l.Availability, l.Name, \
    l.UserListing from User u JOIN Listing l ON u.UserId=l.UserListing WHERE u.UserName =?;`;

    db.execute(baseSQL,[profileName])
    .then(([results, fields]) => {
        if(results && results.length){
            let post = results[0];
            res.render('Profile', {currentProfile: post})
        }else{
            req.flash('error', 'Profile not found');
            res.redirect('/');
        }
    })
})

module.exports = router;