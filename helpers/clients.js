const { default: axios } = require('axios');
const pathLib = require('path');
const https = require('https');

const api = axios.create();

const setupClient = (argv) => {
    const apiPrefix = 'api/v1';
    const { endpoint, rejectUnauthorized, dataSourcePathPrefix } = argv || {};
    const tmp = pathLib.join(dataSourcePathPrefix, apiPrefix);
    const baseURL = new URL(tmp, endpoint);
    api.defaults.baseURL = baseURL.toString();
    if (baseURL.protocol === 'https:') {
        const agent = new https.Agent({ rejectUnauthorized });
        api.defaults.httpsAgent = agent;
    }
};

module.exports = { api, setupClient };
