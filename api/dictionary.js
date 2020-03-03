"use strict";

const L = require('../lib').logger;
const LibUtils = require('../lib').utils;
const constants = require('../config').constants;
const DictionaryClient = require('../client').dictionary;
const dictionaryClientObject = new DictionaryClient();
const logtag = '[api/dictionary]';

class Dictionary {
    static async getWordDefinition(word) {
        try {
            if (typeof (word) !== 'string') {
                throw new TypeError(`Provided word ${word} is not a valid string`);
            }

            let response = await dictionaryClientObject.getWordDefinitions(word);
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

            let response = await dictionaryClientObject.getWordExamples(word);
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async getRandomWord() {
        try {
            let response = await dictionaryClientObject.getRandomWord();
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

            const response = await dictionaryClientObject.getRelatedWords(word);

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
        const randomIndex = LibUtils.getRandomIntInRangeInclusive(0, (wordDefinitions.length - 1));
        return wordDefinitions[randomIndex].text;
    };
    
    static _getWordsAtRandom(words = []) {
        const randomIndex = LibUtils.getRandomIntInRangeInclusive(0, words.length - 1);
        return words[randomIndex];
    };
}

module.exports = Dictionary;