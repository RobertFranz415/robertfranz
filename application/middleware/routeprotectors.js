/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: routerprotectors.js
 * Description: routerprotectors
 */

const routeProtectors = {};

routeProtectors.userIsLoggedIn= function(req, res, next) {
    if(req.session.username){
        next();
    }else{
        resp.redirect('/login');
    }
}

module.exports = routeProtectors;