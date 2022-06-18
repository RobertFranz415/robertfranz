const exp = require('constants');
var express = require('express');
const { handlebars } = require('hbs');
const exhbs = require("express-handlebars");
var path = require('path');
var indexRouter = require("./routes/index")
const app = express();


var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('views/index.hbs');
    
var log = function (entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

app.use(express.static(path.join(__dirname, '/assets')));
app.use(express.static(path.join(__dirname, '/templates')));
app.use(express.static(path.join(__dirname, '/javascript')));

app.engine('hbs', exhbs.engine({
    extname: '.hbs',
    defaultLayout: 'layout.hbs',
    layoutsDir: __dirname + '/views/layout',
    helpers: {
        // emptyObject: (obj) => {
        //     return !(obj.constructor === Object && Object.keys(obj).length == 0);
        // }
    }
}));


app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

module.exports = app;