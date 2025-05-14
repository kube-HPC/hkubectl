const { log } = require('../../helpers/output');
const { get, post } = require('../../helpers/request-helper');

const executeHandler = async ({ endpoint, rejectUnauthorized, username, password, jobId }) => {
    const path = `exec/status/${jobId}`;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    return get({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
};

module.exports = {
    command: 'status <jobId>',
    description: 'Returns a status for the current pipeline',
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
