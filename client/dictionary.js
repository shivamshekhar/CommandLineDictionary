"use strict";

const BaseClient = require('./baseClient');
const apiConfig = require('../config').api;

class RandomWord extends BaseClient {
    /**
     * 
     * Constructor for our RandomWord class. This class is meant to fetch RandomWord data using provided API. It expects following parameters :
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
            CLIENT_NAME : "RANDOM-WORD-CLIENT",
            LOGTAG : "[client/dictionary/RandomWord]",
            ...args //jshint ignore:line
        });
    }

    /**
     * Function which calls the random words api.
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async with() {
        return super.with('/words/randomWord', {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }
}

class Definitions extends BaseClient {
    /**
     * 
     * Constructor for our Definitions class. This class is meant to fetch word definitions using provided API. It expects following parameters :
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
            CLIENT_NAME : "WORD-DEFINATIONS-CLIENT",
            LOGTAG : "[client/dictionary/Definitions]",
            ...args //jshint ignore:line
        });
    }

    /**
     * Function which calls the random words api.
     * 
     * @param {String} word - Word whose definition needs to be fetched
     * 
     * @returns {Promise.<Object|Error>} Returns a promise which either resolves to the required 
     * response body or rejects with the corresponding error.
     */
    async with(word) {
        return super.with(`/word/${word}/definitions`, {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }
}

class Examples extends BaseClient {
    /**
     * 
     * Constructor for our Examples class. This class is meant to fetch word examples using provided API. It expects following parameters :
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
            CLIENT_NAME : "WORD-EXAMPLES-CLIENT",
            LOGTAG : "[client/dictionary/Examples]",
            ...args //jshint ignore:line
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
    async with(word) {
        return super.with(`/word/${word}/examples`, {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }
}

class RelatedWords extends BaseClient {
    /**
     * 
     * Constructor for our RelatedWords class. This class is meant to fetch related words using provided API. It expects following parameters :
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
            CLIENT_NAME : "RELATED-WORDS-CLIENT",
            LOGTAG : "[client/dictionary/RelatedWords]",
            ...args //jshint ignore:line
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
    async with(word) {
        return super.with(`/word/${word}/relatedWords`, {
            method : 'GET',
            qs : {
                api_key : apiConfig.API_KEY,
            },
            json : true,
        });
    }   
}

module.exports = {
    RandomWord,
    Definitions,
    Examples,
    RelatedWords,
};