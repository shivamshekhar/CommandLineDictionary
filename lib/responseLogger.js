"use strict";

const L = require('./logger');

module.exports = function(command, response = {}) {
    L.log(`Response for command ${command} :\n${JSON.stringify(response)}`);
};