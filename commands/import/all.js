const path = require('path');
const { importPipelineData } = require('./pipelines');
const { importAlgorithmData } = require('./algorithms');

async function importData(argv) {
    try {
        const { inputDirectory } = argv;
        const inputPipelineDirectory = path.join(inputDirectory, 'pipelines');
        await importPipelineData({ ...argv, inputDirectory: inputPipelineDirectory });
        const inputAlgorithmsDirectory = path.join(inputDirectory, 'algorithms');
        await importAlgorithmData({ ...argv, inputDirectory: inputAlgorithmsDirectory });
    }
    catch (error) {
        console.error(`Error during import data: ${error.message}`);
    }
}

module.exports = {
    command: 'all <inputDirectory>',
    description: 'Import your algorithms/pipelines files from a chosen directory to your Hkube environment',
    builder: (yargs) => {
        yargs.positional('inputDirectory', {
            demandOption: 'Please provide the directory to import the algorithms from',
            describe: 'path/of/your/directory',
            type: 'string'
        });
        yargs.options({
            registry: {
                describe: 'docker registry for importing algorithms (e.g docker.io, myInternalRegistry)',
                type: 'string',
                alias: ['r']
            },
        });
        yargs.options({
            overwrite: {
                describe: 'Should overwrite exsiting algorithms',
                type: 'boolean',
                alias: ['or']
            },
        });
        process.stdin.pause();
    },
    handler: async (argv) => {
        // eslint-disable-next-line no-param-reassign
        argv.endpoint = argv.e || argv.endpoint;
        await importData(argv);
    },
};
