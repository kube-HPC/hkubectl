const { promisify } = require('util');
const delay = promisify(setTimeout);

module.exports = {
    delay
};
