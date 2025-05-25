const fse = require('fs-extra');
const yaml = require('js-yaml');
const FormData = require('form-data');
const { log } = require('../../../helpers/output');
const { post, postFile } = require('../../../helpers/request-helper');
const { AuthManager } = require('../../../helpers/authentication/auth-manager');
const path = 'store/pipelines';

const readmeAdd = async (readmeFile, endpoint, username, password, rejectUnauthorized, name, auth) => {
    const addPath = `readme/pipelines/${name}`;
    const stream = fse.createReadStream(readmeFile);
    const formData = new FormData();
    formData.append('README.md', {
        value: stream,
        options: {
            filename: 'README.md'
        }
    });
    this._kc_token = await auth.getToken();
    await postFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path: addPath,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
};

const handleAdd = async ({ endpoint, rejectUnauthorized, username, password, file, readmeFile }) => {
    const result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    const body = {
        ...result
    };
    this._kc_token = await auth.getToken();
    const res = await post({
        endpoint,
        rejectUnauthorized,
        body,
        path,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    if (readmeFile) {
        await readmeAdd(readmeFile, endpoint, username, password, rejectUnauthorized, result.name, auth);
    }
    auth.stop();
    return res;
};

module.exports = {
    command: 'store',
    description: 'Store pipeline',
    options: {},
    builder: {
        file: {
            demandOption: true,
            describe: 'path for descriptor file',
            type: 'string',
            alias: ['f']
        },
        readmeFile: {
            describe: 'path for readme file. example: --readmeFile="./readme.md',
            type: 'string'
        }
    },
    handler: async argv => {
        const ret = await handleAdd(argv);
        log(ret, argv);
    }
};
