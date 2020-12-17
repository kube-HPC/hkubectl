const pathLib = require('path');
const axios = require('axios').default;
const https = require('https');
const { URL } = require('url');
const { promisify } = require('util');
const { getError } = require('./error-helper');
const sleep = promisify(setTimeout);

const apiPrefix = 'api/v1/';

const uriBuilder = ({ endpoint, path, qs = {}, usePrefix = true, schema }) => {
    let prefix = apiPrefix;
    const { pathPrefix } = global.args || {};
    prefix = usePrefix ? pathLib.join(pathPrefix, prefix) : '';
    const fullPath = pathLib.join(prefix, path);
    const url = new URL(fullPath, endpoint);
    if (schema) {
        url.protocol = schema;
    }
    Object.entries(qs).forEach(([k, v]) => {
        url.searchParams.append(k, v);
    });
    return url.toString();
};

const _request = async ({ endpoint, rejectUnauthorized, path, method, body, formData, qs, timeout }) => {
    const url = uriBuilder({ endpoint, path, qs });
    let result = null;
    let error;
    let timeoutError = false;
    try {
        const source = axios.CancelToken.source();
        if (timeout) {
            setTimeout(() => {
                if (!result && !error) {
                    source.cancel(`request to ${url} timed out`);
                }
            }, timeout);
        }

        result = await axios({
            method,
            url,
            httpsAgent: https.Agent({ rejectUnauthorized }),
            json: true,
            data: body || formData,
            headers: formData ? formData.getHeaders() : {},
            cancelToken: source.token
        });
    }
    catch (e) {
        if (e instanceof axios.Cancel) {
            timeoutError = true;
        }
        error = getError(e);
    }
    return { timeoutError, error, result: result && result.data };
};

const del = async ({ endpoint, rejectUnauthorized, path, qs }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, method: 'DELETE' });
};

const get = async ({ endpoint, rejectUnauthorized, path, qs, timeout }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, method: 'GET', timeout });
};

const getUntil = async (getOptions, condition, timeout = 20000) => {
    if (!condition) {
        return { error: 'condition function not specified' };
    }
    const startTime = Date.now();
    while (true) {
        if (Date.now() - startTime > timeout) {
            return { error: 'time out waiting for condition' };
        }
        const res = await get(getOptions);
        const conditionResult = condition(res);
        if (conditionResult) {
            return res;
        }
        await sleep(1000);
    }
};
const post = async ({ endpoint, rejectUnauthorized, path, qs, body }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, body, method: 'POST' });
};

const postFile = async ({ endpoint, rejectUnauthorized, path, qs, formData }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, formData, method: 'POST' });
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
    getUntil,
    uriBuilder
};
