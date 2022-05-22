/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: PostsError.js
 * Description: this file handles error messages dealing with posts/listings.
 */

class PostError extends Error{
    constructor(message, redirectURL, status){
        super(message);
        this.redirectURL = redirectURL;
        this.status = status;
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

module.exports = PostError;