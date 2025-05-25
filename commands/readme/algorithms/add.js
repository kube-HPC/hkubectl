const prettyjson = require('prettyjson');
const fse = require('fs-extra');
const FormData = require('form-data');
const { postFile } = require('../../../helpers/request-helper');
const { AuthManager } = require('../../../helpers/authentication/auth-manager');

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
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();

    const result = await postFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    auth.stop();
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
