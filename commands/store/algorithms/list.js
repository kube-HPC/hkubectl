const { get, post } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const list = async (argv) => {
    const path = 'store/algorithms';
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const algorithms = await get({
        ...argv,
        path,
        headers: { Authorization: `Bearer ${res.result.token}` }
    });
    if (!algorithms || !algorithms.result) {
        return algorithms;
    }
    return algorithms.result.map(a => a.name);
};

module.exports = {
    command: 'list',
    description: 'Lists all registered algorithms',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await list(argv);
        log(ret, { ...argv });
    }
};
