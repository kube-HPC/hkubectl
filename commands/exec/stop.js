const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const path = 'exec/stop/';

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, jobId, reason }) => {
    const body = {
        jobId,
        reason
    };
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    return post({
        endpoint,
        rejectUnauthorized,
        path,
        body,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
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
