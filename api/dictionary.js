"use strict";

const DictionaryClient = require('../client').dictionary;

const RandomWordClient = DictionaryClient.RandomWord;
const WordDefinitionClient = DictionaryClient.Definitions;
const WordExamplesClient = DictionaryClient.Examples;
const RelatedWordsClient = DictionaryClient.RelatedWords;

const randomWordClientObject = new RandomWordClient();
const wordDefinitionClientObject = new WordDefinitionClient();
const wordExamplesClientObject = new WordExamplesClient();
const relatedWordsClientObject = new RelatedWordsClient();

class Dictionary {
    static async getWordDefinition(word) {
        try {
            if(typeof(word) !== 'string') {
                throw new Error(`Provided word ${word} is not a valid string`);
            }

            let response = await wordDefinitionClientObject.with(word);
            return response;
        } catch(err) {
            throw err;
        }
    }

    static async getWordExamples(word) {
        try {
            if(typeof(word) !== 'string') {
                throw new Error(`Provided word ${word} is not a valid string`);
            }

            let response = await wordExamplesClientObject.with(word);
            return response;
        } catch(err) {
            throw err;
        }
    }

    static async getRandomWord() {
        try {
            let response = await randomWordClientObject.with();
            return response;
        } catch(err) {
            throw err;
        }
    }

    static async getRelatedWords(word) {
        try {
            if(typeof(word) !== 'string') {
                throw new Error(`Provided word ${word} is not a valid string`);
            }

            let response = await relatedWordsClientObject.with(word);
            return response;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = Dictionary;