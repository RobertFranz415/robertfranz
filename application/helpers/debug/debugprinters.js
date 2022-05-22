/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: debugprinters.js
 * Description: for debugging purposes.
 */

const colors = require('colors');

colors.setTheme({
    error: ['black', 'bgRed'],
    success: ['black', 'bgGreen'],
    request: ['black', 'bgWhite']
})

const printers = {
    errorPrint: (message) => {
        console.log(colors.error(message));
    },
    successPrint: (message) => {
        console.log(colors.success(message));
    },
    requestPrint: (message) => {
        console.log(colors.request(message));
    }
}

module.exports = printers;