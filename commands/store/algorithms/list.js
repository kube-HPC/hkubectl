const { get } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');
const { AuthManager } = require('../../../helpers/authentication/auth-manager');

const list = async (argv) => {
    const path = 'store/algorithms';
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const algorithms = await get({
        ...argv,
        path,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    if (!algorithms || !algorithms.result) {
        auth.stop();
        return algorithms;
    }
    const result = algorithms.result.map(a => a.name);
    auth.stop();
    return result;
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
