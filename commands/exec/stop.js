const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const path = `exec/stop/`;

const executeHandler = async ({ endpoint, rejectUnauthorized, jobId, reason }) => {
    const body = {
        jobId,
        reason
    }
    return post({
        endpoint,
        rejectUnauthorized,
        path,
        body
    });
}

module.exports = {
    command: 'stop <jobId> [reason]',
    alias: ['e'],
    description: 'call to stop pipeline execution',
    options: {
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret);
    }
}
