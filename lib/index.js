'use strict';

var util = require('util');

var logLevels = ['info', 'debug', 'error', 'warn', 'trace'];
var enabled = true;

/**
 * Default console logger for use outside of hapi container
 * @param tags
 * @param message
 */
function logToConsole(tags, message) {
    if (enabled) {
        if (arguments.length < 2) {
            message = tags;
            tags = [];
        }

        if (!util.isArray(tags)) tags = [];

        var text = new Date().getTime() + ', ';
        if (tags.length > 0) {
            text = text + tags[0] + ', ';
        }
        text = text + message;
        console.log(text);
    }
}

/**
 * Assists with parsing var-arg'ed tags
 * @param tags
 * @return {*}
 */
function parseTags(tags) {
    if (tags.length > 0 && util.isArray(tags[0])) {
        tags = tags[0];
    }

    return tags;
}

/**
 * Logger constructor. may be invoked directly or as a constructor
 * @param {string[]=} tags an array of default tags to include with log messages
 * @return {Logger} a new logger instance
 * @constructor
 */
function Logger(tags) {
    tags = parseTags(Array.prototype.slice.call(arguments));

    if (!(this instanceof Logger)) {
        return new Logger(tags);
    }

    this.tags = tags;
}

// the real log function to call. gets swapped out for hapi logger if registered as a plugin
Logger.prototype.log = logToConsole;

logLevels.forEach(function (lvl) {
    Logger.prototype[lvl] = function (tags, message) {
        if (arguments.length < 2) {
            message = tags;
            tags = [];
        }

        // ensure local tags are an array, push the log level on the end
        tags = util.isArray(tags) ? tags : [ tags ];
        tags = tags.concat([lvl]);

        this.log(this.tags.concat(tags), message);
    };
});

Logger.register = function(plugin, opts, next) {
    Logger.prototype.log = plugin.log;
    next();
};

Logger.enabled = function(_enabled_) {
    enabled = _enabled_;
};


module.exports = Logger;