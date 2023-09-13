const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { get } = require('../../helpers/request-helper');

async function fetchAlgorithms(argv) {
    const algoPath = 'store/algorithms';
    const algorithms = await get({
        ...argv,
        path: algoPath
    });
    if (!algorithms || !algorithms.result) {
        return algorithms;
    }
    return algorithms.result;
}

async function fetchAndSaveAlgorithms(argv) {
    const algorithmList = await fetchAlgorithms(argv);

    if (!algorithmList || algorithmList.length === 0) {
        console.log('No algorithms found.');
        return;
    }

    const outputDirectory = argv.o || 'default_output_directory';
    const outputFormat = argv.f || 'json';

    // Ensure the output directory exists
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    // Loop through the algorithms and save their data based on the outputFormat
    if (outputFormat === 'json') {
        for (const algorithm of algorithmList) {
            const filePath = path.join(outputDirectory, `${algorithm.name}.json`);
            fs.writeFileSync(filePath, JSON.stringify(algorithm, null, 2));
            console.log(`Saved ${algorithm.name} JSON to ${filePath}`);
        }
    }
    else if (outputFormat === 'yaml') {
        for (const algorithm of algorithmList) {
            const filePath = path.join(outputDirectory, `${algorithm.name}.yaml`);
            fs.writeFileSync(filePath, yaml.safeDump(algorithm));
            console.log(`Saved ${algorithm.name} YAML to ${filePath}`);
        }
    }
    else {
        console.log(`Output format ${outputFormat} not supported.`);
    }
}

module.exports = {
    command: 'exportAll',
    description: 'Fetch and save algorithms as JSON files in a chosen directory',
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
            await fetchAndSaveAlgorithms(argv);
        }
        catch (error) {
            console.error('Error fetching and saving algorithms:', error.message);
        }
    }
};
