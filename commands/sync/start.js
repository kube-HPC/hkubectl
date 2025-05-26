const { post } = require('../../helpers/request-helper');
const { AuthManager } = require('../../helpers/authentication/auth-manager');

const startHandler = async ({ endpoint, rejectUnauthorized, username, password, algorithmName, devFolder, $0: appName }) => {
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    // get all parameters, decorate
    const body = {
        name: algorithmName,
        options: {
            devMode: true,
            devFolder
        }
    };
    // let res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    const res = await post({ endpoint, rejectUnauthorized, path: 'store/algorithms?overwrite=true', body, headers: { Authorization: `Bearer ${this._kc_token}` } });
    if (res.result.error || res.error) {
        let msg;
        msg = res.result.error.message.includes('missing') ? "algorithm doesn't exist" : msg = res.result.error.message;
        console.log(`code: ${res.result.error.code}, message: ${msg}`);
        auth.stop();
        return;
    }
    console.log(`algorithm ${algorithmName} modified to be in development mode with the synced path being ${devFolder}.`);
    console.log('to sync the folder to the algorithm run:');
    console.log(`${appName} sync watch -a ${algorithmName} -f <localAlgoFolder>`);
    auth.stop();
};
module.exports = {
    command: 'start',
    description: 'Engage development mode for an algorithm',
    options: {
    },
    builder: {
        algorithmName: {
            demandOption: true,
            describe: 'The name of the algorithm to sync files into',
            type: 'string',
            alias: ['a']
        },
        devFolder: {
            demandOption: true,
            describe: 'folder in pod to sync to',
            type: 'string',
            alias: ['f']
        }
    },
    handler: async (argv) => {
        await startHandler(argv);
    }
};
