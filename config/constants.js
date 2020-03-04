"use strict";

/**
 * @module
 * @name Constants
 * @description - All hardcoded constant values are included in this object
 */

/**
 * @namespace Constants
 * @property {Object} WORD_RELATIONSHIP_TYPES - Defines the type of word relationships, i.e synonym, antonym, etc.
 * @property {String} WORD_RELATIONSHIP_TYPES.ANTONYM - Relation type : Antonym
 * @property {String} WORD_RELATIONSHIP_TYPES.SYNONYM - Relation type : Synonym
 * @property {String} WORD_RELATIONSHIP_TYPES.ALL - Relation type : All
 * 
 * @property {Object} GAME_STATES - Defines various states for our game
 * @property {String} GAME_STATES.START - Game State : Start the game
 * @property {String} GAME_STATES.DISPLAY - Game State : Display the word definition, antonym, synonym
 * @property {String} GAME_STATES.PLAY - Game State : Prompt the user to play the game
 * @property {String} GAME_STATES.QUIT - Game State : Quit the game
 * @property {String} GAME_STATES.CHOICE - Game State : Prompt the user for choices
 * @property {String} GAME_STATES.HINT - Game State : Provide hint to the user
 * @property {String} GAME_STATES.CREATE - Game State : Create the dataset at random
 */
const Constants = Object.freeze({
    WORD_RELATIONSHIP_TYPES : {
        ANTONYM : 'antonym',
        SYNONYM : 'synonym',
        ALL : 'all',
    },

    GAME_STATES : {
        START : "start",
        DISPLAY : "display",
        PLAY : "play",
        QUIT : "quit",
        ERROR : "error",
        CHOICE : "choice",
        HINT : "hint",
        CREATE : "create",
    }
});

module.exports = Constants;