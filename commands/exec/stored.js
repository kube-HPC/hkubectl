const yaml = require('js-yaml');
const fse = require('fs-extra');
const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const { waitForBuild } = require('../../helpers/results');
const { AuthManager } = require('../../helpers/authentication/auth-manager');
const path = 'exec/stored/';

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, name, noWait, noResult, file }) => {
    let result;

    if (file) {
        result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    }
    const body = {
        name, ...result
    };
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const execResult = await post({
        endpoint,
        rejectUnauthorized,
        path,
        body,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    if (execResult.error) {
        auth.stop();
        return execResult.error;
    }
    if (noWait) {
        auth.stop();
        return execResult.result;
    }
    auth.stop();
    result = await waitForBuild({ endpoint, rejectUnauthorized, username, password, execResult: execResult.result, noResult, auth });
    return result;
};

module.exports = {
    command: 'stored [name]',
    alias: ['e'],
    description: 'execute pipeline by name',
    options: {
    },
    builder: yargs => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        yargs.options({
            file: {
                demandOption: false,
                describe: 'file path/name for running pipeline',
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
            },
        });
        process.stdin.pause();
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret, argv);
    }
};
