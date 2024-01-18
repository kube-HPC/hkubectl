const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { importAlgorithms, parseUserVals, replaceValsInFile } = require('../../utils/importUtils');

async function importAlgorithmData(argv) {
    const { inputDirectory } = argv;

    try {
        await fs.promises.access(inputDirectory);
    }
    catch (error) {
        console.error(`Error accessing directory: ${error.message}`);
    }
    try {
        const algorithmFiles = await fs.promises.readdir(inputDirectory);
        if (algorithmFiles.length === 0) {
            console.error(`Input directory '${inputDirectory}' is empty.`);
            return;
        }
        const supportedAlgorithmFiles = algorithmFiles.filter(file => file.endsWith('.json') || file.endsWith('.yaml'));

        if (supportedAlgorithmFiles.length === 0) {
            console.warn('No supported files found in the input directory.');
            return;
        }
        const parsedAlgorithms = [];
        const ValuesCounts = {};

        for (const file of supportedAlgorithmFiles) {
            const filePath = path.join(inputDirectory, file);
            let fileContent = await fs.promises.readFile(filePath, 'utf-8');
            const valueMapping = parseUserVals(argv.r);
            if (valueMapping) {
                const result = replaceValsInFile(fileContent, valueMapping);
                fileContent = result.fileContent;

                Object.entries(result.replacedCounts).forEach(([oldValue, count]) => {
                    if (ValuesCounts[oldValue]) {
                        ValuesCounts[oldValue] += count;
                    }
                    else {
                        ValuesCounts[oldValue] = count;
                    }
                });
            }

            try {
                const parsedData = file.endsWith('.json')
                    ? JSON.parse(fileContent)
                    : yaml.safeLoad(fileContent);

                parsedAlgorithms.push(parsedData);
            }
            catch (error) {
                console.error(`Error parsing algorithm file ${file}: ${error.message}`);
            }
        }
        Object.entries(ValuesCounts).forEach(([oldValue, count]) => {
            if (count > 0) {
                console.log(`${count} occurrences of "${oldValue}" found and changed`);
            }
        });

        await importAlgorithms(argv, parsedAlgorithms);
    }
    catch (error) {
        console.error(`Error importing algorithms: ${error.message}`);
    }
}

module.exports = {
    command: 'algorithms <inputDirectory>',
    description: 'Import your algorithms from a chosen directory to your Hkube environment',
    builder: (yargs) => {
        yargs.positional('inputDirectory', {
            demandOption: 'Please provide the directory to import the algorithms from',
            describe: 'path/of/your/directory',
            type: 'string'
        });
        yargs.options({
            registry: {
                describe: 'docker registry for importing algorithms (e.g docker.io, myInternalRegistry)',
                type: 'string',
                alias: ['r']
            },
        });
    },
    handler: async (argv) => {
        try {
            // eslint-disable-next-line no-param-reassign
            argv.endpoint = argv.e || argv.endpoint;
            await importAlgorithmData(argv);
        }
        catch (error) {
            console.error('Error importing algorithms:', error.message);
        }
    },
    importAlgorithmData
};
