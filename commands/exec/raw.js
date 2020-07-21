const yaml = require('js-yaml');
const fse = require('fs-extra');
const getStdin = require('get-stdin');
const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const path = 'exec/raw/';

const executeHandler = async ({ endpoint, rejectUnauthorized, name, file }) => {
    let result;
    if (file === '-') {
        result = yaml.safeLoad(await getStdin());
    }
    else {
        result = yaml.safeLoad(await fse.readFile(file, 'utf8'));
    }
    const body = {
        name, ...result
    };
    return post({
        endpoint,
        rejectUnauthorized,
        path,
        body
    });
};

module.exports = {
    command: 'raw',
    description: 'execute raw pipeline from file',
    options: {
    },
    builder: {
        file: {
            demandOption: true,
            describe: 'file path/name for running pipeline.\nuse - to read from stdin',
            type: 'string',
            alias: ['f']
        },
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret);
    }
};
