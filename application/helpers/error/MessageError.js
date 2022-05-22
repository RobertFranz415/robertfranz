/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: MessageError.js
 * Description: this file handles error messages.
 */

class MessageError extends Error{
    constructor(message,redirectUrl,status){
        super(message);
        this.redirectUrl = redirectUrl
        this.status = status
    }
    getMessage() {
        return this.message;
    }

    getRedirectURL() {
        return this.redirectURL;
    }

    getStatus() {
        return this.status;
    }
}
module.exports = MessageError;