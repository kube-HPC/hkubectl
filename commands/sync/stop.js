const { post } = require('../../helpers/request-helper');

const stopHandler = async ({ endpoint, rejectUnauthorized, algorithmName }) => {
    // get all parameters, decorate,
    const body = {
        payload: JSON.stringify({
            name: algorithmName,
            options: {
                devMode: false,
                devFolder: null
            }
        }),
        options: JSON.stringify({
            allowOverwrite: true
        })
    };
    // send update, if doesn't exist, exit.
    const res = await post({ endpoint, rejectUnauthorized, path: 'store/algorithms?overwrite=true', body });
    if (res.result.error || res.error) {
        let msg;
        msg = res.result.error.message.includes('missing') ? "algorithm doesn't exist" : msg = res.result.error.message;
        console.log(`code: ${res.result.error.code}, message: ${msg}`);
        return;
    }
    console.log(`algorithm ${algorithmName} removed from development mode.`);
    process.exit(0); // release terminal
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
