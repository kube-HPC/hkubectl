const { get } = require('../helpers/request-helper');

async function getAlgorithms(argv) {
    const algoPath = 'store/algorithms';
    const algorithms = await get({
        ...argv,
        path: algoPath
    });
    if (!algorithms || !algorithms.result) {
        return algorithms;
    }
    return algorithms.result;
}

async function getPipelines(argv) {
    const pipelinePath = 'store/pipelines';
    const pipelines = await get({
        ...argv,
        path: pipelinePath
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
