const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { importPipelines } = require('../../utils/importUtils');

async function importPipelineData(argv) {
    try {
        const { inputDirectory, overwrite } = argv;
        if (!fs.existsSync(inputDirectory)) {
            console.error(`Directory "${inputDirectory}" does not exist.`);
            return;
        }
        const pipelinesFiles = await fs.promises.readdir(inputDirectory);
        if (pipelinesFiles.length === 0) {
            console.error(`Input directory '${inputDirectory}' is empty.`);
            return;
        }
        const supportedPipelinesFiles = pipelinesFiles.filter(file => file.endsWith('.json') || file.endsWith('.yaml'));

        if (supportedPipelinesFiles.length === 0) {
            console.warn('No supported files found in the input directory.');
            return;
        }
        const parsedPipelines = [];

        for (const file of supportedPipelinesFiles) {
            const filePath = path.join(inputDirectory, file);
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            try {
                const parsedData = file.endsWith('.json')
                    ? JSON.parse(fileContent)
                    : yaml.safeLoad(fileContent);

                parsedPipelines.push(parsedData);
            }
            catch (error) {
                console.error(`Error parsing pipelines file ${file}: ${error.message}`);
            }
        }

        await importPipelines(argv, parsedPipelines, overwrite);
    }
    catch (error) {
        console.error(`Error importing pipelines: ${error.message}`);
    }
}

module.exports = {
    command: 'pipelines <inputDirectory>',
    description: 'Import your pipelines from a chosen directory to your Hkube environment',
    builder: (yargs) => {
        yargs.positional('inputDirectory', {
            demandOption: 'Please provide the directory to import the algorithms from',
            describe: 'path/of/your/directory',
            type: 'string'
        });
    },
    handler: async (argv) => {
        // eslint-disable-next-line no-param-reassign
        argv.endpoint = argv.e || argv.endpoint;
        await importPipelineData(argv);
    },
    importPipelineData
};
