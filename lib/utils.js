"use strict";

class Utils {
    static getRandomIntInRange(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; 
    }
}

module.exports = Utils;