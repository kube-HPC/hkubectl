const fse = require('fs-extra');
const { log } = require('../../../helpers/output');
const { putFile, post } = require('../../../helpers/request-helper');

const handleUpdate = async (readmeFile, endpoint, username, password, rejectUnauthorized, name) => {
    const path = `readme/algorithms/${name}`;
    const stream = fse.createReadStream(readmeFile);
    const formData = {
        'README.md': {
            value: stream,
            options: {
                filename: 'README.md'
            }
        }
    };
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const result = await putFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
    return result;
};

module.exports = {
    command: 'update <name>',
    description: 'Updates the Readme of the algorithm',
    options: {

    },
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
    handler: async (argv) => {
        const ret = await handleUpdate(argv);
        log(ret, argv);
    }
};
