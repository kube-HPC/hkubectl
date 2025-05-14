const { get, post } = require('../../helpers/request-helper');
const { log } = require('../../helpers/output');

const getHandler = async ({ endpoint, rejectUnauthorized, username, password, jobId }) => {
    const path = `exec/pipelines/${jobId}`;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    return get({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
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
