"use strict";

const readline = require('readline');
const EventEmitter = require('events');
const L = require('../lib').logger;
const LibUtils = require('../lib').utils;
const constants = require('../config').constants;
const DictionaryApi = require('./dictionary');
const logtag = '[api/game]';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rlQuestionPromisified = (question) => {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
};

class GameState extends EventEmitter {
    constructor(...args) {
        super(...args);
    }
}

class Game {
    constructor() {
        this.gameState = new GameState();
    }

    gameplay() {
        let promise = new Promise((resolve, reject) => {
            this.gameState
            .on(constants.GAME_STATES.START, async () => {
                await this._gracefulErrorHandler(this._start.bind(this));
            })
            .on(constants.GAME_STATES.CREATE, async () => {
                await this._gracefulErrorHandler(this._create.bind(this));
            })
            .on(constants.GAME_STATES.DISPLAY, async (randomize) => {
                await this._gracefulErrorHandler(this._displayWordData.bind(this), randomize);
            })
            .on(constants.GAME_STATES.PLAY, async () => {
                await this._gracefulErrorHandler(this._play.bind(this));
            })
            .on(constants.GAME_STATES.CHOICE, async () => {
                await this._gracefulErrorHandler(this._choice.bind(this));
            })
            .on(constants.GAME_STATES.HINT, async () => {
                await this._gracefulErrorHandler(this._hint.bind(this));
            })
            .on(constants.GAME_STATES.QUIT, resolve)
            .on(constants.GAME_STATES.ERROR, reject);
        });

        this.gameState.emit(constants.GAME_STATES.START);
        return promise;
    }

    async _start() {
        L.info(`\n---------------- LET'S PLAY : GUESS THE WORD! ----------------\n`);
        await rlQuestionPromisified(`Instructions :\n\nYou would be provided with a definition, a synonym or an antonym and you need to guess what the original word is!\n\nPress Enter to begin!`);
        L.info(`\nLoading game data... Please wait for a few seconds\n`);
        return this.gameState.emit(constants.GAME_STATES.CREATE);
    }

    async _create() {
        this.randomWord = (await DictionaryApi.getRandomWord()).word;

        this.wordDefinitions = await DictionaryApi.getWordDefinition(this.randomWord);
        
        let relatedWords = await DictionaryApi.getRelatedWords(this.randomWord);

        this.antonyms = DictionaryApi._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.ANTONYM).words;
        
        this.synonyms = DictionaryApi._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.SYNONYM).words;
        
        L.info(`-----------------------------------------------------------------\n`);
        
        return this.gameState.emit(constants.GAME_STATES.DISPLAY);
    }

    async _displayWordData(randomize = true) {
        const wordData = this._getWordData(randomize);        

        L.info(`Definition : ${wordData.wordDefinition}\n`);

        if (wordData.synonym) {
            L.info(`Synonym : ${wordData.synonym}\n`);
        }

        if (wordData.antonym) {
            L.info(`Antonym : ${wordData.antonym}\n`);
        }

        return this.gameState.emit(constants.GAME_STATES.PLAY);
    }

    async _play() {
        let answer = (await rlQuestionPromisified(`Guess the word : `)) || '';

        if (this._checkForCorrectAnswer(answer)) {
            L.info(`\nYou guessed it correctly! The word is ${answer}`);
            return this.gameState.emit(constants.GAME_STATES.QUIT);
        } else {
            L.info(`\nProvided answer ${answer} is incorrect!\n`);
            return this.gameState.emit(constants.GAME_STATES.CHOICE);
        }
    }

    async _choice() {
        L.info(`-----------------------------------------------------------------\n`);
        L.info(`1 : Try Again\n2 : Get a hint\n3 : Quit\n`);
        const choice = await rlQuestionPromisified(`Select an option to proceed : `);
        L.info(``);

        switch(choice) {
            case '1' :
                return this.gameState.emit(constants.GAME_STATES.DISPLAY, false);
            case '2' :
                return this.gameState.emit(constants.GAME_STATES.HINT);
            case '3' :
                return this.gameState.emit(constants.GAME_STATES.QUIT);
            default:
                L.info(`Incorrect choice : ${choice}. Please try again!\n`);
                return this.gameState.emit(constants.GAME_STATES.CHOICE);
        }
    }

    async _hint() {
        L.info(`-----------------------------------------------------------------\n`);
        const wordData = this._getWordData(true);
        const wordDefinition = wordData.wordDefinition;
        const synonym = wordData.synonym;
        const antonym = wordData.antonym;
        const jumbledWord = LibUtils.jumbleWord(this.randomWord);

        const hints = [];

        if(wordDefinition !== undefined) {
            hints.push(`Hint : Another definition : ${wordDefinition}\n`);
        }

        if(synonym !== undefined) {
            hints.push(`Hint : Another Synonym : ${synonym}\n`);
        }

        if(antonym !== undefined) {
            hints.push(`Hint : Another Antonym : ${antonym}\n`);
        }

        if(jumbledWord !== undefined) {
            hints.push(`Hint : Jumbled Word : ${jumbledWord}\n`);
        }

        L.info(hints[LibUtils.getRandomIntInRangeInclusive(0, hints.length - 1)]);

        return this.gameState.emit(constants.GAME_STATES.PLAY);
    }

    async _gracefulErrorHandler(promiseFunc, ...args) {
        try {
            if(typeof(promiseFunc) !== 'function') {
                throw new TypeError(`Provided function is not of valid type`);
            }

            return await promiseFunc(...args);
        } catch(err) {
            return this.gameState.emit(constants.GAME_STATES.ERROR, err);
        }
    }

    _getWordData(randomize) {
        if(randomize) {
            this.wordDefinition = DictionaryApi._getRandomDefinition(this.wordDefinitions);
            this.antonym = DictionaryApi._getWordsAtRandom(this.antonyms);
            this.synonym = DictionaryApi._getWordsAtRandom(this.synonyms);
        }

        return {
            wordDefinition : this.wordDefinition,
            antonym : this.antonym,
            synonym : this.synonym,
        };
    }

    _checkForCorrectAnswer(answer = '') {
        answer = answer.toString().toLowerCase();
        return (answer !== this.synonym && (this.synonyms.includes(answer) || answer === this.randomWord));
    }
}

class GameApi {
    static async play() {
        try {
            let game = new Game();
            await game.gameplay();
        } catch(err) {
            throw err;
        }
    }
}

module.exports = GameApi;