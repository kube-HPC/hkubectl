const { get } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');
const { AuthManager } = require('../../../helpers/authentication/auth-manager');

const list = async (argv) => {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const path = 'store/algorithms';
    const result = await get({
        ...argv,
        path,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
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
        log(ret, { ...argv, printOptions: { inlineArrays: true } });
    }
};
