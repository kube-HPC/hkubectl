const path = require('path')
const { URL } = require('url');
const { log } = require('../../helpers/output');
const fs = require('fs-extra');
const { writeValue } = require('../../helpers/config');

const handler = async ({ key, value }) => {
    return writeValue({ key, value });
}

module.exports = {
    command: 'set [key] [value]',
    description: 'Sets configuration options.',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await handler(argv);
        log(ret);
    }
}
