const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const { AuthManager } = require('../../helpers/authentication/auth-manager');
const path = 'exec/stop/';

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, jobId, reason }) => {
    const body = {
        jobId,
        reason
    };
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const result = post({
        endpoint,
        rejectUnauthorized,
        path,
        body,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    auth.stop();
    return result;
};

module.exports = {
    command: 'stop <jobId> [reason]',
    description: 'call to stop pipeline execution',
    builder: (yargs) => {
        yargs.positional('jobId', {
            demandOption: 'Please provide the job Id',
            describe: 'The jobId to get the result',
            type: 'string'
        });
        yargs.positional('reason', {
            describe: 'Reason for stopping the pipeline',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret, argv);
    }
};
