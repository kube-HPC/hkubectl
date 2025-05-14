const fse = require('fs-extra');
const yaml = require('js-yaml');
const FormData = require('form-data');
const { log } = require('../../../helpers/output');
const { post, postFile } = require('../../../helpers/request-helper');
const path = 'store/pipelines';

const readmeAdd = async (readmeFile, endpoint, username, password, rejectUnauthorized, name) => {
    const addPath = `readme/pipelines/${name}`;
    const stream = fse.createReadStream(readmeFile);
    const formData = new FormData();
    formData.append('README.md', {
        value: stream,
        options: {
            filename: 'README.md'
        }
    });
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    await postFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path: addPath,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
};

const handleAdd = async ({ endpoint, rejectUnauthorized, username, password, file, readmeFile }) => {
    const result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    const body = {
        ...result
    };
    let res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    res = await post({
        endpoint,
        rejectUnauthorized,
        body,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
    if (readmeFile) {
        await readmeAdd(readmeFile, endpoint, username, password, rejectUnauthorized, result.name);
    }
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
