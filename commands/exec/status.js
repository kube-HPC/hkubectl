const { log } = require('../../helpers/output');
const { get } = require('../../helpers/request-helper');

const executeHandler = async ({ endpoint, rejectUnauthorized, jobId }) => {
    const path = `exec/status/${jobId}`;
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
};

module.exports = {
    command: 'status <jobId>',
    alias: ['e'],
    description: 'Returns a status for the current pipeline',
    options: {
    },
    builder: {

    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret);
    }
};
