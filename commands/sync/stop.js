const { post } = require('../../helpers/request-helper');
const { AuthManager } = require('../../helpers/authentication/auth-manager');

const stopHandler = async ({ endpoint, rejectUnauthorized, username, password, algorithmName }) => {
    // get all parameters, decorate,
    const body = {
        name: algorithmName,
        options: {
            devMode: false,
            devFolder: null
        }
    };
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    // send update, if doesn't exist, exit.
    const res = await post({ endpoint, rejectUnauthorized, path: 'store/algorithms?overwrite=true', body, headers: { Authorization: `Bearer ${this._kc_token}` } });
    if (res.result.error || res.error) {
        let msg;
        msg = res.result.error.message.includes('missing') ? "algorithm doesn't exist" : msg = res.result.error.message;
        console.log(`code: ${res.result.error.code}, message: ${msg}`);
        return;
    }
    console.log(`algorithm ${algorithmName} removed from development mode.`);
    auth.stop();
};
module.exports = {
    command: 'stop',
    description: 'Disengage development mode for an algorithm',
    options: {
    },
    builder: {
        algorithmName: {
            demandOption: true,
            describe: 'The name of the algorithm to stop syncing files into',
            type: 'string',
            alias: ['a']
        }
    },
    handler: async (argv) => {
        await stopHandler(argv);
    }
};
