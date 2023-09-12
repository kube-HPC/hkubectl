const fs = require('fs');
const path = require('path');
const { get } = require('../../helpers/request-helper');
const { getHandler } = require('../store/algorithms/get');

async function getAlgorithmData(argv) {
    const algorithmPath = 'store/algorithms/';
    const algorithmData = await get({
        ...argv,
        path: algorithmPath
    });
    if (!algorithmData || !algorithmData.result) {
        return null;
    }
    return algorithmData.result;
}

module.exports = {
    command: 'exportAll -o [/path/to/output/directory]',
    alias: ['o'],
    description: 'Export all algorithms from source environment',
    options: {
    },
    builder: (yargs) => {
        yargs.positional('directory', {
            demandOption: 'Please provide the full directory',
            describe: 'your/output/directory',
            type: 'string'
        });
        yargs.options('endpoint', {
            description: 'URL of hkube API endpoint',
            type: 'string',
            default: 'http://127.0.0.1/hkube/api-server/'
        }).options('rejectUnauthorized', {
            description: 'Set to false to ignore certificate signing errors. Useful for self-signed TLS certificate',
            type: 'boolean',
            default: 'true'
        }).options('output', {
            alias: ['o'],
            description: 'Path to the output directory where JSON/YAML files will be stored',
            type: 'string',
            default: false
        });
    },
    handler: async (argv) => {
        try {
            const sourceAlgorithms = await getHandler(argv);
            if (!sourceAlgorithms || sourceAlgorithms.length === 0) {
                console.log('No algorithms found in the source environment.');
                return;
            }

            // Create the output directory if it doesn't exist
            const outputDirectory = path.resolve(argv.output);
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory, { recursive: true });
            }

            // Export each algorithm as a JSON/YAML file
            for (const algorithm of sourceAlgorithms) {
                const algorithmData = await getAlgorithmData(argv, algorithm);
                if (algorithmData) {
                    const filePath = path.join(outputDirectory, `${algorithm}.json`);
                    fs.writeFileSync(filePath, JSON.stringify(algorithmData, null, 2));
                    console.log(`Exported ${algorithm} to ${filePath}`);
                }
                else {
                    console.warn(`Skipping export of ${algorithm} as it couldn't be retrieved from the source environment.`);
                }
            }
        // eslint-disable-next-line brace-style
        } catch (error) {
            console.error('Error exporting algorithms:', error.message);
        }
    }
};
