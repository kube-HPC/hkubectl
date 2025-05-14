const pathLib = require('path');
const axios = require('axios').default;
const https = require('https');
const { URL } = require('url');
const { promisify } = require('util');
const { getError } = require('./error-helper');
const sleep = promisify(setTimeout);

const apiPrefix = 'api/v1/';

const uriBuilder = ({ endpoint, path, qs = {} }) => {
    let prefix = apiPrefix;
    const { pathPrefix } = global.args || {};
    prefix = pathLib.join(pathPrefix, prefix);
    const fullPath = pathLib.join(prefix, path);
    const url = new URL(fullPath, endpoint);
    Object.entries(qs).forEach(([k, v]) => {
        url.searchParams.append(k, v);
    });
    return url.toString();
};

const _request = async ({ endpoint, rejectUnauthorized, path, method, body, formData, qs, timeout, headers = {} }) => {
    const url = uriBuilder({ endpoint, path, qs });
    let result;
    let error;
    try {
        result = await axios({
            method,
            url,
            httpsAgent: https.Agent({ rejectUnauthorized }),
            json: true,
            data: body || formData,
            headers: {
                ...headers,
                ...(formData ? formData.getHeaders() : {})
            },
            timeout,
            maxBodyLength: 1e15,
            maxContentLength: 1e15
        });
    }
    catch (e) {
        error = getError(e);
    }
    return { error, result: result && result.data };
};

const del = async ({ endpoint, rejectUnauthorized, path, qs, headers }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, method: 'DELETE', headers });
};

const get = async ({ endpoint, rejectUnauthorized, path, qs, timeout, headers }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, method: 'GET', timeout, headers });
};

const post = async ({ endpoint, rejectUnauthorized, path, qs, body, headers }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, body, method: 'POST', headers });
};

const getUntil = async (getOptions, condition, timeout = 20000) => {
    if (!condition) {
        return { error: 'condition function not specified' };
    }
    const { username, password, ...getOptionsNoCredentials } = getOptions;
    const startTime = Date.now();
    while (true) {
        if (Date.now() - startTime > timeout) {
            return { error: 'time out waiting for condition' };
        }
        let res = await post({ endpoint: getOptionsNoCredentials.endpoint, rejectUnauthorized: getOptionsNoCredentials.rejectUnauthorized, path: '/auth/login', body: { username, password } });
        getOptionsNoCredentials.headers = { Authorization: `Bearer ${res.result.token}` };
        res = await get(getOptions);
        const conditionResult = condition(res);
        if (conditionResult) {
            return res;
        }
        await sleep(1000);
    }
};

const postFile = async ({ endpoint, rejectUnauthorized, path, qs, formData, headers }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, formData, method: 'POST', headers });
};

const put = async ({ endpoint, rejectUnauthorized, path, qs, body }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, body, method: 'PUT' });
};

const putFile = async ({ endpoint, rejectUnauthorized, path, qs, formData }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, formData, method: 'PUT' });
};

module.exports = {
    get,
    post,
    postFile,
    put,
    putFile,
    del,
    getUntil
};
