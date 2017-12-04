const winston = require('winston')
const colors = require('colors')
const util = require('util')

let slackOnError = true
let slackOnWarn = true

// ============================================================
// TODO custom level for secutiry, access ect
// ============================================================
class LoggerConnectionManager {
    // ============================================================
    //
    // ============================================================
    static silly (msg, ...meta) {
        return LoggerConnectionManager.GLOBAL_LOGGER.silly(msg, ...meta)
    }

    // ============================================================
    //
    // ============================================================
    static verbose (msg, ...meta) {
        return LoggerConnectionManager.GLOBAL_LOGGER.verbose(msg, ...meta)
    }

    // ============================================================
    //
    // ============================================================
    static debug (msg, ...meta) {
        return LoggerConnectionManager.GLOBAL_LOGGER.debug(msg, ...meta)
    }

    // ============================================================
    //
    // ============================================================
    static info (msg, ...meta) {
        return LoggerConnectionManager.GLOBAL_LOGGER.info(msg, ...meta)
    }

    // ============================================================
    //
    // ============================================================
    static warn (msg, ...meta) {
        const slack = require('../workers/libs/slack-error-notification')
        if (slackOnWarn) {
            let slackMsg = msg
            if (meta && meta.length)
                slackMsg = slackMsg + '\n```' + util.format(meta) + '```'
            slack.warn(slackMsg)
        }

        return LoggerConnectionManager.GLOBAL_LOGGER.warn(msg, ...meta)
    }

    // ============================================================
    //
    // ============================================================
    static error (msg, ...meta) {
        const slack = require('../workers/libs/slack-error-notification')
        if (slackOnError) {
            let slackMsg = msg
            if (meta && meta.length)
                slackMsg = slackMsg + '\n```' + util.format(meta) + '```'
            slack.error(slackMsg)
        }

        return LoggerConnectionManager.GLOBAL_LOGGER.error(msg, ...meta)
    }
}

// ============================================================
// private functions - initiat statis instance of winston
// ============================================================

function init (LoggerConnectionManager) {
    // static property LoggerConnectionManager.GLOBAL_LOGGER
    if (!LoggerConnectionManager.GLOBAL_LOGGER) {
        let config = {prettyPrint: true}
        if (process.env.NODE_ENV !== 'PROD')
            config.colorize = true
        LoggerConnectionManager.GLOBAL_LOGGER = new (winston.Logger)({
            transports: [

                new (winston.transports.Console)(config)
            ]
        })

        LoggerConnectionManager.GLOBAL_LOGGER.level = process.env.LOG_LEVEL || 'silly'
    }
}
init(LoggerConnectionManager)
module.exports = exports = LoggerConnectionManager
