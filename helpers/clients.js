const { default: axios } = require('axios');
const pathLib = require('path');
const https = require('https');

const api = axios.create();

const setupClient = (argv) => {
    const apiPrefix = 'api/v1';
    const { endpoint, rejectUnauthorized, dataSourcePathPrefix } = argv || {};
    if (!endpoint) {
        return;
    }
    const tmp = pathLib.join(dataSourcePathPrefix, apiPrefix);
    try {
        const baseURL = new URL(tmp, endpoint);
        api.defaults.baseURL = baseURL.toString();
        if (baseURL.protocol === 'https:') {
            const agent = new https.Agent({ rejectUnauthorized });
            api.defaults.httpsAgent = agent;
        }
    }
    catch (error) {
        console.error(error);
    }
};

module.exports = { api, setupClient };
