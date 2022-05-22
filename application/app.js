/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: app.js
 * Description: this file handles all the important functionality for our app.
 * ex. Sessions, flash, routing etc.
 */
var express = require('express');
var db = require('./config/Database');
const { handlebars } = require('hbs');
var exhbs = require('express-handlebars');
var path = require('path');
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts"); //
var indexRouter = require('./routes/index');
var messageRouter = require('./routes/messages');
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;
var flash = require('express-flash');
var app = express();

//cookie parser var
var cookieParser = require('cookie-parser');

//*session variables */
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.hbs');

var log = function (entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

app.use(express.static(path.join(__dirname, '/FrontEnd')));


//cookies
app.use(cookieParser());

app.engine('hbs', exhbs({
    extname: 'hbs',
    defaultLayout: 'layout.hbs',
    layoutsDir: __dirname + '/views/layout',
    helpers: {
        emptyObject: (obj) => {
            return !(obj.constructor === Object && Object.keys(obj).length == 0);
        }
    }
}));

app.use(flash());
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*sessions code start */
var mysqlSessionStore = new mysqlSession(
    {
        /**using default options */
    }, require("./config/Database")
);

app.use(sessions({
    key: "csid",
    secret: "this is a secret from csc648",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false,
}));
/*sessions code end */

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

//below changes login button to logout when user is logged in
app.use((req, res, next) => {
    if (req.session.username) {
        res.locals.logged = true;
    }
    next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/messages", messageRouter);
//for making posts
app.use('/posts', postsRouter);

app.use((err, req, res, next) => {

    res.render("error", { err_message: err });
})

app.get('/AboutUsHome', (req, res) => {
    res.render('AboutUsHome.hbs', { username: req.session.username });
});

app.get('/AboutRobert', (req, res) => {
    res.render('AboutRobert.hbs', { username: req.session.username });
});

app.get('/AboutSuraj', (req, res) => {
    res.render('AboutSuraj.hbs', { username: req.session.username });
});

app.get('/AboutStephanie', (req, res) => {
    res.render('AboutStephanie.hbs', { username: req.session.username });
});

app.get('/AboutRyan', (req, res) => {
    res.render('AboutRyan.hbs', { username: req.session.username });
});

app.get('/AboutJay', (req, res) => {
    res.render('AboutJay.hbs', { username: req.session.username });
});

app.get('/AboutDoug', (req, res) => {
    res.render('AboutDoug.hbs', { username: req.session.username });
});

app.get('/BecomeTutor', (req, res) => {
    res.render('BecomeTutor.hbs', { username: req.session.username });
});

app.get('/Profile', (req, res) => {
    res.render('Profile.hbs', { username: req.session.username });
});

app.get('/Message', (req, res) => {
    res.render('Message.hbs', { username: req.session.username });
});

app.get('/LoggedInListings', (req, res) => {
    res.render('LoggedInListings.hbs');
});

app.get('/PrivacyPolicy', (req, res) => {
    res.render('PrivacyPolicy.hbs', { username: req.session.username });
});

app.get('/Inbox', (req, res) => {
    res.render('Inbox.hbs', { username: req.session.username });
});

app.get('/VPResults', (req, res, next) => {

    let searchTerm = req.query.search;
    let searchTable = req.query.from;
    //console.log("SearchTable: ", searchTable);
    if (searchTable != 0) {
        if (!searchTerm) {
            return db.query(`select distinct u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, l.ListingDescription, l.ListingPrice, l.ListingCategory, \
        l.UserListing, l.Thumbnail, l.Availability, l.Name from User u, Listing l where u.UserId = l.UserListing AND ApprovalStatus = 1 AND l.ListingCategory=${searchTable} ORDER BY created DESC;`, [])
                .then(([results, fields]) => {
                    res.send({
                        resultsStatus: "info",
                        message: `Showing 1-${results.length} listings`,
                        results: results
                    });
                });
        } else {
            let baseSQL = `SELECT u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, l.ListingDescription, l.ListingPrice, l.ListingCategory, l.UserListing, l.Thumbnail, l.Availability, l.Name, concat_ws(' ', l.ListingTittle, l.ListingDescription, l.ListingCategory, u.UserName) AS haystack FROM User u, Listing l where l.UserListing = u.UserId AND ApprovalStatus = 1 AND l.ListingCategory=${searchTable} HAVING haystack like ?;`;

            let sqlReadySearchTerm = "%" + searchTerm + "%";
            db.execute(baseSQL, [sqlReadySearchTerm])
                .then(([results, fields]) => {
                    if (results && results.length) {
                        res.send({
                            resultsStatus: "info",
                            message: `${results.length} results found`,
                            results: results
                        });
                    } else {
                        return db.query(`select distinct u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, l.ListingDescription, l.ListingPrice, l.ListingCategory, \
                l.UserListing, l.Thumbnail, l.Availability, l.Name from User u, Listing l where u.UserId = l.UserListing AND ApprovalStatus = 1 AND l.ListingCategory=${searchTable} ORDER BY created DESC;`, [])
                            .then(([results, fields]) => {
                                res.send({
                                    resultsStatus: "info",
                                    message: "No results were found, here are some recent listings",
                                    results: results
                                });
                            });
                    }
                })
                .catch((err) => next(err));
        }
    } else if (searchTable == 0){
        if (!searchTerm) {
            return db.query(`select distinct u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, l.ListingDescription, l.ListingPrice, l.ListingCategory, l.UserListing, l.Thumbnail, l.Availability, l.Name from User u, Listing l where u.UserId = l.UserListing AND ApprovalStatus = 1 ORDER BY created DESC;`, [])
                .then(([results, fields]) => {
                    res.send({
                        resultsStatus: "info",
                        message: `Showing 1-${results.length} listings`,
                        results: results
                    });
                });
        } else {
            let baseSQL = `SELECT u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, l.ListingDescription, l.ListingPrice, l.ListingCategory, l.UserListing, l.Thumbnail, l.Availability, l.Name, concat_ws(' ', l.ListingTittle, l.ListingDescription, l.ListingCategory, u.UserName) AS haystack FROM Listing l, User u where l.UserListing = u.UserId HAVING haystack like ?;`;

            let sqlReadySearchTerm = "%" + searchTerm + "%";
            db.execute(baseSQL, [sqlReadySearchTerm])
                .then(([results, fields]) => {
                    if (results && results.length) {
                        res.send({
                            resultsStatus: "info",
                            message: `${results.length} results found`,
                            results: results
                        });
                    } else {
                        return db.query(`select distinct u.UserName, u.UserRating, u.Image, l.ListingId, l.ListingTittle, l.ListingDescription, l.ListingPrice, l.ListingCategory, l.UserListing, l.Thumbnail, l.Availability, l.Name from User u, Listing l where u.UserId = l.UserListing ORDER BY created DESC;`, [])
                            .then(([results, fields]) => {
                                res.send({
                                    resultsStatus: "info",
                                    message: "No results were found, here are some recent listings",
                                    results: results
                                });
                            });
                    }
                })
                .catch((err) => next(err));
        }
    }
});

app.listen(port, () => {
    console.log("Listening on port: " + port);
});

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');

module.exports = app;


