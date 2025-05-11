const { get, post } = require('../helpers/request-helper');

async function getAlgorithms(argv) {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const algoPath = 'store/algorithms';
    const algorithms = await get({
        ...argv,
        path: algoPath,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
    if (!algorithms || !algorithms.result) {
        return algorithms;
    }
    return algorithms.result;
}

async function getPipelines(argv) {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const pipelinePath = 'store/pipelines';
    const pipelines = await get({
        ...argv,
        path: pipelinePath,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
    if (!pipelines || !pipelines.result) {
        return pipelines;
    }
    return pipelines.result;
}

module.exports = {
    getPipelines,
    getAlgorithms
};
