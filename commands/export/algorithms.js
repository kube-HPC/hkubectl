const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getAlgorithms } = require('../../utils/exportUtils');

async function exportAlgorithmData(argv, data) {
    const outputDirectory = argv.o || 'default/output/directory';
    const outputFormat = argv.f || 'json';
    try {
        // Ensure the output directory exists
        await fs.promises.access(outputDirectory);

        try {
            await fs.promises.access(outputDirectory);
        }
        catch (err) {
            console.error(`Error accessing diectory: ${err.message}`);
        }
        for (const file of data) {
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
        console.error(`Error exporting algorithms: ${error.message}`);
    }
}
async function getAndSave(argv) {
    const algorithmList = await getAlgorithms(argv);

    if (!algorithmList || algorithmList.length === 0) {
        console.log('No algorithms found.');
        return;
    }
    await exportAlgorithmData(argv, algorithmList);
}

module.exports = {
    command: 'algorithms',
    description: 'get and save all algorithms as JSON/YAML files in a chosen directory',
    builder: (yargs) => {
        yargs.positional('directory', {
            demandOption: 'Please provide the directory to save the algorithms to',
            describe: 'path/of/your/directory',
            type: 'string'
        });
        yargs.options({
            outputFolder: {
                describe: 'Output folder',
                type: 'string',
                default: 'default_output_directory',
                alias: ['o']
            },
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
            await getAndSave(argv);
        }
        catch (error) {
            console.error('Error geting and saving algorithms:', error.message);
        }
    }
};
