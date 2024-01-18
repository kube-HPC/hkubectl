const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getPipelines } = require('../../utils/exportUtils');

async function exportPipelineData(argv) {
    const { outputDirectory } = argv;
    const outputFormat = argv.f || 'json';
    try {
        const pipelineList = await getPipelines(argv);

        if (!pipelineList || pipelineList.length === 0) {
            console.log('No algorithms found.');
            return;
        }
        try {
            await fs.promises.access(outputDirectory);
        }
        catch (err) {
            console.error(`Error accessing directory: ${err.message}`);
        }
        for (const file of pipelineList) {
            const fileName = `${file.name}.${outputFormat === 'json' ? 'json' : 'yaml'}`;
            const filePath = path.join(outputDirectory, fileName);
            if (outputFormat === 'json') {
                await fs.promises.writeFile(filePath, JSON.stringify(file, null, 2));
            }
            else if (outputFormat === 'yaml') {
                await fs.promises.writeFile(filePath, yaml.safeDump(file));
            }
            console.log(`Saved ${file.name}.${outputFormat} to ${filePath}`);
        }
    }
    catch (error) {
        console.error(`Error exporting pipelines: ${error.message}`);
    }
}

module.exports = {
    command: 'pipelines <outputDirectory>',
    description: 'get and save all pipelines as JSON/YAML files in a chosen directory',
    builder: (yargs) => {
        yargs.positional('outputDirectory', {
            demandOption: 'Please provide the directory to save the pipelines to',
            describe: 'path/of/your/directory',
            type: 'string'
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
        try {
            // eslint-disable-next-line no-param-reassign
            argv.endpoint = argv.e || argv.endpoint;
            await exportPipelineData(argv);
        }
        catch (error) {
            console.error('Error geting and saving pipelines:', error.message);
        }
    },
    exportPipelineData
};
