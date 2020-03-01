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
            //TODO : add string type checks
            let response = await wordDefinitionClientObject.with(word);
            return response;
        } catch(err) {
            // TODO : log
            throw err;
        }
    }

    static async getWordExamples(word) {
        try {
            //TODO : add string type checks
            let response = await wordExamplesClientObject.with(word);
            return response;
        } catch(err) {
            // TODO : log
            throw err;
        }
    }

    static async getRandomWord() {
        try {
            //TODO : add string type checks
            let response = await randomWordClientObject.with();
            return response;
        } catch(err) {
            // TODO : log
            throw err;
        }
    }

    static async getRelatedWords(word) {
        try {
            //TODO : add string type checks
            let response = await relatedWordsClientObject.with(word);
            return response;
        } catch(err) {
            // TODO : log
            throw err;
        }
    }
}

module.exports = Dictionary;

// standalone runner function for function testing and debugging
(async function() {
    if(require.main == module) {
        try {
            console.log(await Dictionary.getRelatedWords("house"));
            process.exit(0);
        } catch(err) {
            console.log('Some error occurred', err);
            process.exit(1);
        }
    }
}())