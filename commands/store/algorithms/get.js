const { get } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');
const { AuthManager } = require('../../../helpers/authentication/auth-manager');

const getHandler = async ({ endpoint, rejectUnauthorized, username, password, name }) => {
    const path = `store/algorithms/${name}`;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const result = await get({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    auth.stop();
    return result;
};

module.exports = {
    command: 'get <name>',
    description: 'Gets an algorithm by name',
    builder: (yargs) => {
        yargs.positional('name', {
            demand: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await getHandler(argv);
        log(ret.result || ret, argv);
    }
};
