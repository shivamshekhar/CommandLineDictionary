"use strict";

/**
 * @module
 * @name Utils
 * @description - Basic utility module
 */

/**
 * @class
 */
class Utils {
    /**
     * 
     * Function which generates a random Number between min and max values provided (both inclusive)
     * 
     * @param {Number} [min = Number.MIN_SAFE_INTEGER] - Lower limit of range (Inclusive)
     * @param {Number} [max = Number.MAX_SAFE_INTEGER] - Upper limit of range (Inclusive)
     * @returns {Number} - A random number between min and max (inclusive). 
     */
    static getRandomIntInRangeInclusive(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
        const isInvalidInputArgs = [min, max].some(val => {
            return (val === undefined || val === null || val === '' || isNaN(val));
        });

        if(isInvalidInputArgs) {
            throw new Error(`Provided input min : ${min} OR max : ${max} is not a valid Number`);
        }
        
        min = Math.ceil(Number(min));
        max = Math.floor(Number(max));
        return Math.floor(Math.random() * (max + 1 - min)) + min; 
    }

    /**
     * 
     * Function which jumbles a string using Fischer-Yates Algorithm
     * 
     * @param {String} word - Word which needs to be jumbled.
     * @returns {String} - Returns the jumbled word
     */
    static jumbleWord(word) {
        word = (word === undefined ? '' : word).toString().split('');
        for(let i = 0; i < word.length - 1; i++) {
            let randomIndex = this.getRandomIntInRangeInclusive(i + 1, word.length - 1);
            let tmpLetter = word[i];
            word[i] = word[randomIndex];
            word[randomIndex] = tmpLetter;
        }

        return word.join('');
    }
}

module.exports = Utils;