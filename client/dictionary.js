"use strict";

const BaseClient = require('./baseClient');
const apiConfig = require('../config').api;

/**
 * @class
 * @extends BaseClient
 */
class Dictionary extends BaseClient {
    /**
     * 
     * Constructor for our Dictionary class. This class is meant to fetch various word data like definition, synonym, antonym, etc using provided APIs. It expects following parameters :
     * 
     * @param {Object} [options = {}] - Following are supported and may be passed as options :
     * 
     * @param {...any} [options.args] - Any arguments which needs to be passed as options to the parent class' constructor. For more details, refer to parent class' documentation.
     *
     * @see BaseClient
     */
    constructor({
        ...args //jshint ignore:line
    } = {}) {
        super({
            ENDPOINT : apiConfig.HOST,
            TIMEOUT : apiConfig.TIMEOUT,
            CLIENT_NAME : "DICTIONARY-CLIENT",
            LOGTAG : "[client/dictionary/Dictionary]",
            ...args //jshint ignore:line
        });
    }

    /**
     * Function which calls the random words api.
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async getRandomWord() {
        return super.with('/words/randomWord', {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }

    /**
     * Function which calls the word definitions api.
     * 
     * @param {String} word - Word whose definition needs to be fetched
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async getWordDefinitions(word) {
        return super.with(`/word/${word}/definitions`, {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }

    /**
     * Function which calls the word examples api.
     * 
     * @param {String} word - Word whose examples needs to be fetched
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async getWordExamples(word) {
        return super.with(`/word/${word}/examples`, {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }

    /**
     * Function which calls the related words api.
     * 
     * @param {String} word - Word whose related words needs to be fetched
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async getRelatedWords(word) {
        return super.with(`/word/${word}/relatedWords`, {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }
}

module.exports = Dictionary;