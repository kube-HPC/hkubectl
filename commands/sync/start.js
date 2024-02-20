const { post } = require('../../helpers/request-helper');

const startHandler = async ({ endpoint, rejectUnauthorized, algorithmName, devFolder, $0: appName }) => {
    // get all parameters, decorate,
    const body = {
        name: algorithmName,
        options: {
            devMode: true,
            devFolder
        }
    };
    // send update, if doesn't exist, exit.
    const res = await post({ endpoint, rejectUnauthorized, path: 'store/algorithms?overwrite=true', body });
    if (res.result.error || res.error) {
        let msg;
        if (res.result.error.code === 400) {
            msg = "algorithm doesn't exist";
        }
        else {
            msg = res.result.error.message;
        }
        console.log(`code: ${res.result.error.code}, message: ${msg}`);
        return;
    }
    console.log(`algorithm ${algorithmName} modified to be in development mode.`);
    console.log('to sync the folder to the algorithm run');
    console.log(`${appName} sync watch -a ${algorithmName} -f localAlgoFolder}`);
};
module.exports = {
    command: 'start',
    description: 'start an existing algorithm in development mode',
    options: {
    },
    builder: {
        algorithmName: {
            demandOption: true,
            describe: 'The name of the algorithm to sync data into',
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
