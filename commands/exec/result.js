const { log } = require('../../helpers/output');
const { get, post } = require('../../helpers/request-helper');

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, jobId }) => {
    const path = `exec/results/${jobId}`;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    return get({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
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
