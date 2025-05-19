const { log } = require('../../helpers/output');
const { get } = require('../../helpers/request-helper');
const { AuthManager } = require('../../helpers/authentication/auth-manager');

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, jobId }) => {
    const path = `exec/results/${jobId}`;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    return get({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
};

module.exports = {
    command: 'result <jobId>',
    description: 'returns result for the execution of a specific pipeline run',
    options: {
    },
    builder: (yargs) => {
        yargs.positional('jobId', {
            demandOption: 'Please provide the job Id',
            describe: 'The jobId to get the result',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret, argv);
    }
};
