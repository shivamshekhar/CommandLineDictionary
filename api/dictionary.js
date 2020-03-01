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

    static async getRelatedWords(word, relationshipType = 'all') {
        try {
            if(typeof(word) !== 'string') {
                throw new Error(`Provided word ${word} is not a valid string`);
            }

            const response = await relatedWordsClientObject.with(word);

            let finalResponse;

            for(let row of response) {
                if(row.relationshipType === relationshipType) {
                    finalResponse = row;
                    break;
                }
            }

            if(finalResponse === undefined) {
                if(relationshipType === 'all') {
                    finalResponse = response;
                } else {
                    throw new Error(`Unsupported relationship type ${relationshipType} provided for fetching related words for ${word}`);
                }
            } 

            return finalResponse;
        } catch(err) {
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
        } catch(err) {
            throw err;
        }
    }

    static async gameplay() {
        try {

        } catch(err) {
            throw err;
        }
    }
}

module.exports = Dictionary;