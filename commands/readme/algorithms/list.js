const { get, post } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const list = async (argv) => {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const path = 'store/algorithms';
    return get({
        ...argv,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
};

module.exports = {
    command: 'list',
    description: 'Lists all registered algorithms',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await list(argv);
        log(ret, { ...argv, printOptions: { inlineArrays: true } });
    }
};
