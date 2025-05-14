const { get, post } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const getHandler = async ({ endpoint, rejectUnauthorized, username, password, name }) => {
    const path = `store/algorithms/${name || ''}`;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    return get({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
};

module.exports = {
    command: 'get [name]',
    description: 'Gets an algorithm by name',
    options: {

    },
    builder: yargs => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await getHandler(argv);
        log(ret, argv);
    }
};
