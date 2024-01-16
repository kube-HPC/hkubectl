const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getAlgorithms, getPipelines } = require('../../utils/exportUtils');

async function exportData(argv, data, dataType = false) {
    const outputFormat = argv.f || 'json';

    let outputDirectory;
    if (dataType === false) {
        outputDirectory = path.join(argv.o, 'pipelines');
    }
    else {
        outputDirectory = path.join(argv.o, 'algorithms');
    }
    // Ensure the output directory exists
    if (!fs.existsSync(argv.o)) {
        console.log(`Folder "${argv.o}" does not exist.`);
    }

    else {
        fs.mkdirSync(outputDirectory, { recursive: true });
        console.log(`Folder "${outputDirectory}" created.`);
    }

    // Loop through the data and save it based on the outputFormat
    for (const file of data) {
        const filePath = path.join(outputDirectory, `${file.name}.${outputFormat}`);
        if (outputFormat === 'json') {
            fs.writeFileSync(filePath, JSON.stringify(file, null, 2));
            console.log(`Saved ${file.name} JSON to ${filePath}`);
        }
        else if (outputFormat === 'yaml') {
            fs.writeFileSync(filePath, yaml.safeDump(file));
            console.log(`Saved ${file.name} YAML to ${filePath}`);
        }
        else {
            console.log(`Output format ${outputFormat} not supported.`);
        }
    }
}

async function getAndSave(argv) {
    const pipelineList = await getPipelines(argv);
    if (!pipelineList || pipelineList.length === 0) {
        console.log('No pipelines found.');
        return;
    }
    await exportData(argv, pipelineList, false);
    const algorithmList = await getAlgorithms(argv);

    if (!algorithmList || algorithmList.length === 0) {
        console.log('No algorithms found.');
        return;
    }
    await exportData(argv, algorithmList, true);
}

module.exports = {
    command: 'all',
    description: 'get and save all algorithms/pipelines as JSON/YAML files in a chosen directory',
    builder: (yargs) => {
        yargs.positional('directory', {
            demandOption: 'Please provide the directory to save the algorithms to',
            describe: 'path/of/your/directory',
            type: 'string'
        });
        yargs.options({
            dataType: {
                describe: 'Data type to export (e.g. algorithms, pipelines)',
                type: 'string',
                default: 'algorithms',
                alias: ['d']
            },
            outputFolder: {
                describe: 'Output folder',
                type: 'string',
                default: 'default_output_directory',
                alias: ['o']
            },
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
            await getAndSave(argv);
        }
        catch (error) {
            console.error('Error geting and saving algorithms:', error.message);
        }
    }
};
