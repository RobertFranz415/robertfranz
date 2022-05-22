/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: postsmiddleware.js
 * Description: this files handles the middleware used by posts.
 */

var db = require("../config/Database");
const postMiddleware = {}

postMiddleware.getRecentPosts = function(req, res, next) {
    let baseSQL = `select distinct u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, l.ListingDescription, l.ListingPrice, l.ListingCategory, \
    l.UserListing from User u, l where u.UserId = l.UserListing ORDER BY created`; 
    db.execute(baseSQL, [])
    .then(([results, fields]) => {
        res.locals.results = results;
        if(results && results.length == 0){
            req.flash('error', 'There are no posts created yet');
        }
        next();
    })
    .catch((err) => next(err));
}

module.exports = postMiddleware;