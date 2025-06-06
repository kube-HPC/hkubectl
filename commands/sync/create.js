const path = require('path');
const { handleApply } = require('../store/algorithms/applyImpl');
const { buildDoneEvents } = require('../../helpers/consts');
const { askMissingValues } = require('../../helpers/input');

const createHandler = async ({ endpoint, rejectUnauthorized, username, password, algorithmName, folder, entryPoint, env, baseImage, $0: appName }) => {
    try {
        const fullFolderPath = path.resolve(folder);
        const algorithmData = {
            codePath: fullFolderPath,
            options: {
                devMode: true
            },
            codeEntryPoint: entryPoint,
            env,
            baseImage
        };
        const { buildStatus } = await handleApply({
            endpoint, rejectUnauthorized, username, password, name: algorithmName, wait: true, forceVersion: true, ...algorithmData
        });
        console.log(`build status is ${JSON.stringify(buildStatus)}`);
        if (buildStatus === buildDoneEvents.completed) {
            console.log(`algorithm ${algorithmName} is ready`);
            console.log('to sync the folder to the algorithm run');
            console.log(`${appName} sync watch -a ${algorithmName} -f ${folder}`);
        }
        process.exit(0); // release terminal
    }
    catch (error) {
        console.error(`error Creating algorithm. Error: ${error.message}`);
        process.exit(0); // release terminal
    }
};
module.exports = {
    command: 'create',
    description: 'creates the algorithm for development.',
    options: {
    },
    builder: (yargs) => {
        const options = {
            algorithmName: {
                demandOption: true,
                describe: 'The name of the algorithm',
                type: 'string',
                alias: ['a']
            },
            folder: {
                demandOption: false,
                describe: 'local folder to build from.',
                default: './',
                type: 'string',
                alias: ['f']
            },
            env: {
                describe: 'algorithm runtime environment',
                type: 'string',
                choices: ['python', 'nodejs']

            },
            entryPoint: {
                describe: 'the main file of the algorithm',
                type: 'string',
                alias: ['e']
            },
            baseImage: {
                describe: 'base image for the algorithm',
                type: 'string'
            }
        };
        yargs.middleware(async (args) => {
            const fillMissing = [{ name: 'env', type: 'list' }, { name: 'entryPoint', type: 'input' }];
            return askMissingValues(fillMissing, options, args);
        });
        yargs.options(options);

        yargs.completion();
        return yargs;
    },
    handler: async (argv) => {
        await createHandler(argv);
    }

};
