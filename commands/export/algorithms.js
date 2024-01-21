const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getAlgorithms } = require('../../utils/exportUtils');

async function exportAlgorithmData(argv) {
    const { outputDirectory } = argv;
    const outputFormat = argv.f || 'json';
    try {
        const algorithmList = await getAlgorithms(argv);

        if (!algorithmList || algorithmList.length === 0) {
            console.log('No algorithms found.');
            return;
        }

        try {
            await fs.promises.access(outputDirectory);
        }
        catch (err) {
            console.error(`directory '${outputDirectory}' does not exists: ${err.message}`);
            return;
        }
        for (const file of algorithmList) {
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

module.exports = {
    command: 'algorithms <outputDirectory>',
    description: 'get and save all algorithms as JSON/YAML files in a chosen directory',
    builder: (yargs) => {
        yargs.positional('outputDirectory', {
            demandOption: 'Please provide the directory to save the algorithms to',
            describe: 'path/of/your/directory',
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
            await exportAlgorithmData(argv);
        }
        catch (error) {
            console.error('Error geting and saving algorithms:', error.message);
        }
    },
    exportAlgorithmData
};
