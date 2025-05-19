const { get } = require('../../helpers/request-helper');
const { log } = require('../../helpers/output');
const { AuthManager } = require('../../helpers/authentication/auth-manager');

const getHandler = async ({ endpoint, rejectUnauthorized, username, password, jobId }) => {
    const path = `exec/pipelines/${jobId}`;
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
    command: 'get <jobId>',
    description: 'Returns the executed pipeline data',
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
        const ret = await getHandler(argv);
        log(ret, argv);
    }
};
