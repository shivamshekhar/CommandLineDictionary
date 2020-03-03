"use strict";

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