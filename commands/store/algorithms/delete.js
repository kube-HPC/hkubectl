const { del, } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');
const { AuthManager } = require('../../../helpers/authentication/auth-manager');

const delHandler = async ({ endpoint, rejectUnauthorized, username, password, name }) => {
    const path = `store/algorithms/${name}`;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const result = del({
        endpoint,
        rejectUnauthorized,
        path,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    auth.stop();
    return result;
};

module.exports = {
    command: 'delete <name>',
    description: 'Deletes an algorithm by name',
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
