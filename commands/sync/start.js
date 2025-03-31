const { post } = require('../../helpers/request-helper');

const startHandler = async ({ endpoint, rejectUnauthorized, algorithmName, devFolder, $0: appName }) => {
    // get all parameters, decorate
    const body = {
        payload: JSON.stringify({
            name: algorithmName,
            options: {
                devMode: true,
                devFolder
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
    console.log(`algorithm ${algorithmName} modified to be in development mode with the synced path being ${devFolder}.`);
    console.log('to sync the folder to the algorithm run:');
    console.log(`${appName} sync watch -a ${algorithmName} -f <localAlgoFolder>`);
    process.exit(0); // release terminal
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
