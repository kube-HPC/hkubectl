const prettyjson = require('prettyjson');

const tryJson = (data) => {
    try {
        return JSON.stringify(data, null, 2);
    }
    catch (error) {
        return data;
    }
};
const log = (data, { json, printOptions } = {}) => {
    if (json) {
        console.log(tryJson(data));
    }
    else {
        console.log(prettyjson.render(data, printOptions));
    }
};

const simpleLog = (message) => {
    log(message, { json: false });
};

log.warning = simpleLog;
log.info = simpleLog;
log.error = (message, error) => simpleLog(`${message}. Error: ${(error && error.message) ? error.message : error}`);
module.exports = {
    log
};
