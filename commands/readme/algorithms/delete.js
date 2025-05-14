const { del, post } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const delHandler = async ({ endpoint, rejectUnauthorized, username, password, name }) => {
    const path = `store/algorithms/${name}`;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    return del({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
};

module.exports = {
    command: 'delete <name>',
    description: 'Deletes the readme of an algorithm by name',
    builder: (yargs) => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await delHandler(argv);
        log(ret, argv);
    }
};
