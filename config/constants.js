"use strict";

/**
 * @module
 * @name Constants
 * @description - All hardcoded constant values are included in this object
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