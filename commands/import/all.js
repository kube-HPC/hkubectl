const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { post } = require('../../helpers/request-helper');

async function importAlgorithms(argv) {
    const inputDirectory = argv.i || 'default_input_directory';

    // Check if the input directory exists
    if (!fs.existsSync(inputDirectory)) {
        console.error(`Input directory '${inputDirectory}' not found.`);
        return;
    }

    // Get a list of all files in the input directory
    const files = fs.readdirSync(inputDirectory);

    for (const file of files) {
        // Check if the file has a supported extension (json or yaml)
        if (file.endsWith('.json') || file.endsWith('.yaml')) {
            const filePath = path.join(inputDirectory, file);
            const algorithmData = fs.readFileSync(filePath, 'utf-8');

            try {
                // Parse the algorithm data based on the file extension
                const parsedAlgorithm = file.endsWith('.json')
                    ? JSON.parse(algorithmData)
                    : yaml.safeLoad(algorithmData);

                // Perform the import operation for the algorithm
                const algoPath = 'store/algorithms';
                const response = await post({
                    ...argv,
                    path: algoPath,
                    body: parsedAlgorithm,
                });

                if (response.result) {
                    console.log(`${file} Imported`);
                }
                else {
                    console.error(`Error importing ${file}: message: ${response.error.message}`);
                }
            }
            catch (error) {
                console.error(`Error importing ${file}: ${error.message}`);
            }
        }
        else {
            console.warn(`Skipping unsupported file: ${file}`);
        }
    }
}

module.exports = {
    command: 'all',
    description: 'Import your algorithms as JSON/YAML files from a chosen directory to your Hkube environment',
    builder: (yargs) => {
        yargs.positional('directory', {
            demandOption: 'Please provide the directory to import the algorithms from',
            describe: 'path/of/your/directory',
            type: 'string'
        });
        yargs.options({
            outputFolder: {
                describe: 'Origin directory to import the algorithms from',
                type: 'string',
                default: 'default_Origin_directory',
                alias: ['i']
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
            await importAlgorithms(argv);
        }
        catch (error) {
            console.error('Error importing algorithms:', error.message);
        }
    },
};
