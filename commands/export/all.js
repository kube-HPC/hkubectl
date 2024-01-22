const fs = require('fs');
const path = require('path');
const { exportPipelineData } = require('./pipelines');
const { exportAlgorithmData } = require('./algorithms');

async function exportData(argv) {
    try {
        const { outputDirectory } = argv;
        if (!fs.existsSync(outputDirectory)) {
            console.error(`Directory "${outputDirectory}" does not exist.`);
            return;
        }
        const outputPipelineDirectory = path.join(outputDirectory, 'pipelines');
        fs.mkdirSync(outputPipelineDirectory, { recursive: true });
        console.log(`Folder "${outputPipelineDirectory}" created.`);
        await exportPipelineData({ ...argv, outputDirectory: outputPipelineDirectory });

        const outputAlgorithmsDirectory = path.join(outputDirectory, 'algorithms');
        fs.mkdirSync(outputAlgorithmsDirectory, { recursive: true });
        console.log(`Folder "${outputAlgorithmsDirectory}" created.`);
        await exportAlgorithmData({ ...argv, outputDirectory: outputAlgorithmsDirectory });
    }
    catch (error) {
        console.error(`Error importing files: ${error.message}`);
    }
}

module.exports = {
    command: 'all <outputDirectory>',
    description: 'Get and save all algorithms/pipelines as JSON/YAML files in a chosen directory',
    builder: (yargs) => {
        yargs.positional('outputDirectory', {
            demandOption: 'Please provide the directory to save the algorithms to',
            describe: 'Path of your directory',
            type: 'string',
        });
        yargs.options({
            format: {
                describe: 'Output format (e.g. json, yaml)',
                type: 'string',
                default: 'json',
                alias: ['f']
            },
        });
    },
    handler: async (argv) => {
        // eslint-disable-next-line no-param-reassign
        argv.endpoint = argv.e || argv.endpoint;
        await exportData(argv);
    }
};
