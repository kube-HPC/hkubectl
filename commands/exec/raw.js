const yaml = require('js-yaml');
const fse = require('fs-extra');
const getStdin = require('get-stdin');
const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const { waitForBuild } = require('../../helpers/results');

const path = 'exec/raw/';

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, name, file, noWait, noResult }) => {
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
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const execResult = await post({
        endpoint,
        rejectUnauthorized,
        path,
        body,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });

    if (execResult.error) {
        return execResult.error;
    }
    if (noWait) {
        return execResult.result;
    }
    return waitForBuild({ endpoint, rejectUnauthorized, username, password, execResult: execResult.result, noResult });
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
        noWait: {
            describe: 'if true, does not wait for the execution to finish',
            type: 'boolean',
            default: false,
        },
        noResult: {
            describe: 'if true, does not show the result of the execution',
            type: 'boolean',
            default: false,
        }
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret, argv);
    }
};
