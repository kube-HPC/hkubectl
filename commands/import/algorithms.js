const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { importAlgorithms, parseUserVals, replaceValsInFile } = require('../../utils/importUtils');

async function importAlgorithmData(argv) {
    try {
        const { inputDirectory, overwrite } = argv;
        if (!fs.existsSync(inputDirectory)) {
            console.error(`Directory "${inputDirectory}" does not exist.`);
            return;
        }
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
            const codeRegex = new RegExp('Code', 'g');
            fileContent = fileContent.replace(codeRegex, 'Image');
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

        await importAlgorithms(argv, parsedAlgorithms, overwrite);
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
            replace: {
                describe: 'Replace a value like docker registry  (e.g docker.io, myInternalRegistry)',
                type: 'string',
                alias: ['r']
            },
        });
        yargs.options({
            overwrite: {
                describe: 'Should overwrite exsiting algorithms',
                type: 'boolean',
                alias: ['or']
            },
        });
        process.stdin.pause();
    },
    handler: async (argv) => {
        // eslint-disable-next-line no-param-reassign
        argv.endpoint = argv.e || argv.endpoint;
        await importAlgorithmData(argv);
    },
    importAlgorithmData
};
