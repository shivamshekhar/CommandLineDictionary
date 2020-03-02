"use strict";

const readLine = require('readline');
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
            throw new Error(`Unsupported relationship type ${relationshipType} provided for getting related words for ${word}`);
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

        return finalResponse
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

    static gameplay() {
        const rl = readLine.createInterface({
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

        return new Promise(async (resolve, reject) => {
            L.info(`---------------- LET'S PLAY : GUESS THE WORD! ----------------`);
            await rlQuestionPromisified(`\nInstructions :\nYou would be provided with a definition, a synonym or an antonym and you need to guess what the original word is!\n\nPress Enter to begin!`);

            while (true) {
                try {
                    const randomWord = (await this.getRandomWord()).word;
                    const relatedWords = await this.getRelatedWords(randomWord);
                    const wordDefinitions = await this.getWordDefinition(randomWord);

                    let antonyms = this._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.ANTONYM).words; 
                    let synonyms = this._parseRelatedWordsResponse(relatedWords, constants.WORD_RELATIONSHIP_TYPES.SYNONYM).words;

                    L.info(`-----------------------------------------------------------------`);
                    L.info(`Definition : ${getRandomDefinition(wordDefinitions)}\n`);

                    if (synonyms) {
                        L.info(`Synonym : ${synonyms[LibUtils.getRandomIntInRange(0, synonyms.length - 1)]}\n`);
                    }

                    if (antonyms) {
                        L.info(`Antonym : ${antonyms[LibUtils.getRandomIntInRange(0, antonyms.length - 1)]}\n`);
                    }

                    const answer = await rlQuestionPromisified(`Guess the word : `);
                    console.log(answer, (answer === randomWord), randomWord);
                    break;
                } catch (err) {
                    console.log(err);
                    return reject(err);
                }
            }

            return resolve();
        });
    }
}

module.exports = Dictionary;