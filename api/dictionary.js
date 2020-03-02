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

const getRandomDefinition = (wordDefinitions) => {
    const randomIndex = LibUtils.getRandomIntInRange(0, (wordDefinitions.length - 1));
    return wordDefinitions[randomIndex].text;
};

const getRandomRelatedWord = (words = []) => {
    return words[LibUtils.getRandomIntInRange(0, words.length - 1)];
};

class Game {
    constructor(...args) {
        this.gameState = new GameState();
    }

    gameplay() {
        let promise = new Promise((resolve, reject) => {
            this.gameState
            .on('start', async () => {
                try {
                    await this._start();
                } catch(err) {
                    this.gameState.emit('error', err);
                }
            })
            .on('create', async () => {
                try {
                    await this._create();
                } catch(err) {
                    this.gameState.emit('error', err);
                }
            })
            .on('play', async () => {
                try {
                    await this._play();
                } catch(err) {
                    this.gameState.emit('error', err);
                }
            })
            .on('choice', async () => {
                try {
                    await this._choice();
                } catch(err) {
                    this.gameState.emit('error', err);
                }
            })
            .on('hint', async () => {
                try {
                    await this._hint();
                } catch(err) {
                    this.gameState.emit('error', err);
                }
            })
            .on('exit', resolve)
            .on('error', reject);
        });

        this.gameState.emit('start');
        return promise;
    }

    async _start() {
        L.info(`\n---------------- LET'S PLAY : GUESS THE WORD! ----------------\n`);
        await rlQuestionPromisified(`\nInstructions :\nYou would be provided with a definition, a synonym or an antonym and you need to guess what the original word is!\n\nPress Enter to begin!`);
        return this.gameState.emit('create');
    }

    async _create() {
        this.randomWord = (await Dictionary.getRandomWord()).word;

        let wordDefinitions = await Dictionary.getWordDefinition(this.randomWord);
        this.wordDefinition = getRandomDefinition(wordDefinitions);
        
        let relatedWords = await Dictionary.getRelatedWords(this.randomWord);

        let antonyms = Dictionary._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.ANTONYM).words;
        this.antonym = getRandomRelatedWord(antonyms);

        let synonyms = Dictionary._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.SYNONYM).words;
        this.synonym = getRandomRelatedWord(synonyms);

        return this.gameState.emit('play');
    }

    async _play() {
        L.info(`-----------------------------------------------------------------\n`);
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
            return this.gameState.emit('exit');
        } else {
            L.info(`\nProvided answer ${answer} is incorrect!\n\n`);
            return this.gameState.emit('choice');
        }
    }

    async _choice() {
        L.info(`-----------------------------------------------------------------\n`);
        L.info(`1 : Try Again\n2 : Get a hint\n3 : Quit\n\n`);
        const choice = await rlQuestionPromisified(`Select an option to proceed : `);

        switch(choice) {
            case '1' :
                return this.gameState.emit('play');
            case '2' :
                return this.gameState.emit('hint');
            case '3' :
                return this.gameState.emit('exit');
            default:
                L.info(`Incorrect choice : ${choice}. Please try again!`);
                return this.gameState.emit('choice');
        }
    }

    async _hint() {
        L.info(`-----------------------------------------------------------------\n`);
        L.info(`Hint : Jumbled word : ${LibUtils.jumbleWord(this.randomWord)}`);
        return this.gameState.emit('play');
    }
}

class GameState extends EventEmitter {
    constructor(...args) {
        super(...args);
    }
}

class Dictionary {
    static async getWordDefinition(word) {
        try {
            if (typeof (word) !== 'string') {
                throw new Error(`Provided word ${word} is not a valid string`);
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
                throw new Error(`Provided word ${word} is not a valid string`);
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
                throw new Error(`Provided word ${word} is not a valid string`);
            }

            const response = await relatedWordsClientObject.with(word);

            return this._parseRelatedWordsResponse(response, relationshipType);
        } catch (err) {
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
}

module.exports = Dictionary;