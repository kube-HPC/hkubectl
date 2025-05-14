const prettyjson = require('prettyjson');
const fse = require('fs-extra');
const FormData = require('form-data');
const { postFile, post } = require('../../../helpers/request-helper');

const handleAdd = async ({ endpoint, rejectUnauthorized, username, password, name, readmeFile }) => {
    const path = `readme/algorithms/${name}`;
    const stream = fse.createReadStream(readmeFile);
    const formData = new FormData();
    formData.append('README.md', {
        value: stream,
        options: {
            filename: 'README.md'
        }
    });
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const result = await postFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
    return result;
};

module.exports = {
    command: 'add <name>',
    description: 'Adds a Readme to the algorithm',
    options: {},
    builder: (yargs) => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        yargs.options('readmeFile', {
            describe: 'path for readme file. example: --readmeFile="./readme.md',
            type: 'string'
        });
    },
    handler: async argv => {
        const ret = await handleAdd(argv);
        console.log(prettyjson.render(ret));
    }
};
