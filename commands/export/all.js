const fs = require('fs');
const path = require('path');
const { exportPipelineData } = require('./pipelines');
const { exportAlgorithmData } = require('./algorithms');

async function exportData(argv) {
    try {
        const { outputDirectory } = argv;
        const outputPipelineDirectory = path.join(outputDirectory, 'pipelines');
        if (!fs.existsSync(outputDirectory)) {
            console.error(`Folder "${outputPipelineDirectory}" does not exist.`);
        }
        else {
            fs.mkdirSync(outputPipelineDirectory, { recursive: true });
            console.log(`Folder "${outputPipelineDirectory}" created.`);
        }
        await exportPipelineData({ ...argv, outputDirectory: outputPipelineDirectory });

        const outputAlgorithmsDirectory = path.join(outputDirectory, 'algorithms');
        if (!fs.existsSync(outputDirectory)) {
            console.error(`Folder "${outputAlgorithmsDirectory}" does not exist.`);
        }
        else {
            fs.mkdirSync(outputAlgorithmsDirectory, { recursive: true });
            console.log(`Folder "${outputAlgorithmsDirectory}" created.`);
        }
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
                describe: 'Output format (e.g., json, yaml)',
                type: 'string',
                default: 'json',
                alias: ['f']
            },
        });
    },
    handler: async (argv) => {
        try {
            // eslint-disable-next-line no-param-reassign
            argv.endpoint = argv.e || argv.endpoint;
            await exportData(argv);
        }
        catch (error) {
            console.error('Error getting and saving data:', error.message);
        }
    }
};
