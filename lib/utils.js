"use strict";

class Utils {
    static getRandomIntInRange(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; 
    }

    static jumbleWord(word) {
        word = (word === undefined ? '' : word).toString().split('');
        for(let i = 0; i < word.length - 1; i++) {
            let randomIndex = this.getRandomIntInRange(i + 1, word.length - 1);
            let tmpLetter = word[i];
            word[i] = word[randomIndex];
            word[randomIndex] = tmpLetter;
        }

        return word.join('');
    }
}

module.exports = Utils;