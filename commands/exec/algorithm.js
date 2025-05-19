const yaml = require('js-yaml');
const fse = require('fs-extra');
const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const { waitForBuild } = require('../../helpers/results');
const { AuthManager } = require('../../helpers/authentication/auth-manager');
const path = 'exec/algorithm/';

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, name, file, noWait, noResult }) => {
    let loadResult;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    if (file) {
        loadResult = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    }
    const body = {
        name, ...loadResult
    };
    const execResult = await post({
        endpoint,
        rejectUnauthorized,
        path,
        body,
        headers: { Authorization: `Bearer ${this._kc_token}` }
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
    command: 'algorithm [name]',
    alias: ['e'],
    description: 'execute algorithm',
    options: {
    },
    builder: yargs => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        const options = {
            file: {
                demandOption: false,
                describe: 'file path/name for extra data',
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
        };
        yargs.options(options);
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret, argv);
    }
};
