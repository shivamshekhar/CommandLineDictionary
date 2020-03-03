"use strict";

const readline = require('readline');
const EventEmitter = require('events');
const L = require('../lib').logger;
const LibUtils = require('../lib').utils;
const constants = require('../config').constants;
const DictionaryClient = require('../client').dictionary;

const RandomWordClient = DictionaryClient.RandomWord;
const WordDefinitionClient = DictionaryClient.Definitions;
const WordExamplesClient = DictionaryClient.Examples;
const RelatedWordsClient = DictionaryClient.RelatedWords;

const randomWordClientObject = new RandomWordClient();
const wordDefinitionClientObject = new WordDefinitionClient();
const wordExamplesClientObject = new WordExamplesClient();
const relatedWordsClientObject = new RelatedWordsClient();

const logtag = '[api/dictionary]';

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
            .on(constants.GAME_STATES.PLAY, async (randomize) => {
                await this._gracefulErrorHandler(this._play.bind(this), randomize);
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
        this.randomWord = (await Dictionary.getRandomWord()).word;

        this.wordDefinitions = await Dictionary.getWordDefinition(this.randomWord);
        
        let relatedWords = await Dictionary.getRelatedWords(this.randomWord);

        this.antonyms = Dictionary._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.ANTONYM).words;
        
        this.synonyms = Dictionary._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.SYNONYM).words;
        
        L.info(`-----------------------------------------------------------------\n`);
        
        return this.gameState.emit(constants.GAME_STATES.PLAY);
    }

    async _play(randomize = true) {
        if(randomize) {
            this.wordDefinition = Dictionary._getRandomDefinition(this.wordDefinitions);
            this.antonym = Dictionary._getRandomRelatedWord(this.antonyms);
            this.synonym = Dictionary._getRandomRelatedWord(this.synonyms);
        }

        L.info(`Definition : ${this.wordDefinition}\n`);

        if (this.synonym) {
            L.info(`Synonym : ${this.synonym}\n`);
        }

        if (this.antonym) {
            L.info(`Antonym : ${this.antonym}\n`);
        }

        const answer = (await rlQuestionPromisified(`Guess the word : `)) || '';

        if (answer.toString().toLowerCase() === this.randomWord) {
            L.info(`\nYou guessed it correctly! The word is ${this.randomWord}`);
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
                return this.gameState.emit(constants.GAME_STATES.PLAY, false);
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
        L.info(`Hint : Jumbled word : ${LibUtils.jumbleWord(this.randomWord)}\n`);
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
}

class Dictionary {
    static async getWordDefinition(word) {
        try {
            if (typeof (word) !== 'string') {
                throw new TypeError(`Provided word ${word} is not a valid string`);
            }

            let response = await wordDefinitionClientObject.with(word);
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async getWordExamples(word) {
        try {
            if (typeof (word) !== 'string') {
                throw new TypeError(`Provided word ${word} is not a valid string`);
            }

            let response = await wordExamplesClientObject.with(word);
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async getRandomWord() {
        try {
            let response = await randomWordClientObject.with();
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async getRelatedWords(word, relationshipType = constants.WORD_RELATIONSHIP_TYPES.ALL) {
        try {
            if (typeof (word) !== 'string') {
                throw new TypeError(`Provided word ${word} is not a valid string`);
            }

            const response = await relatedWordsClientObject.with(word);

            return this._parseRelatedWordsResponse(response, relationshipType);
        } catch (err) {
            throw err;
        }
    }

    static async getAll(word) {
        try {
            let [definition, relation, examples] = await Promise.all([
                this.getWordDefinition(word),
                this.getRelatedWords(word),
                this.getWordExamples(word),
            ]);

            return {
                word,
                definition,
                relation,
                examples,
            };
        } catch (err) {
            throw err;
        }
    }

    static async gameplay() {
        try {
            let game = new Game();
            await game.gameplay();
        } catch(err) {
            throw err;
        }
    }

    static _parseRelatedWordsResponse(relatedWordsResponse, relationshipType) {
        let finalResponse = {};

        if(!Object.values(constants.WORD_RELATIONSHIP_TYPES).includes(relationshipType)) {
            throw new Error(`Unsupported relationship type ${relationshipType} provided for getting related words`);
        }

        if(relationshipType === constants.WORD_RELATIONSHIP_TYPES.ALL) {
            return relatedWordsResponse;
        }

        for (let row of relatedWordsResponse) {
            if (row.relationshipType === relationshipType) {
                finalResponse = row;
                break;
            }
        }

        return finalResponse;
    }

    static _getRandomDefinition(wordDefinitions) {
        const randomIndex = LibUtils.getRandomIntInRange(0, (wordDefinitions.length - 1));
        return wordDefinitions[randomIndex].text;
    };
    
    static _getRandomRelatedWord(words = []) {
        return words[LibUtils.getRandomIntInRange(0, words.length - 1)];
    };
}

module.exports = Dictionary;