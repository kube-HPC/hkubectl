const commands = require('../commands/exec/index');

const exportAll = {
    command: 'exportAll -o /path/to/output/directory',
    description: 'export all algorithms from source environment',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });
        yargs.options('endpoint', {
            alias: ['e'],
            description: 'url of hkube api endpoint',
            type: 'string',
            default: 'http://127.0.0.1/hkube/api-server/'
        })
            .options('rejectUnauthorized', {
                description: 'set to false to ignore certificate signing errors. Useful for self signed TLS certificate',
                type: 'boolean',
                default: 'true'
            }).strict();
        return yargs;
    },
    handler: () => { }

};

module.exports = {
    exportAll
};
// const exportAlgorithms = async (sourceEnv, outputDirectory) => {
//     // Step 1: Fetch all algorithms from the source environment using your custom request function.
//     const response = await commands.getAlgorithms(sourceEnv);
//     if (response.status !== 200) {
//         console.error('Failed to fetch algorithms from the source environment.');
//         return;
//     }
//     const algorithms = response.data;
//     // Step 2: Create the output directory if it doesn't exist.
//     if (!fs.existsSync(outputDirectory)) {
//         fs.mkdirSync(outputDirectory, { recursive: true });
//     }
//     // Step 3: Iterate through the algorithms and save them as JSON or YAML files.
//     for (const algorithm of algorithms) {
//         const fileName = `${outputDirectory}/${algorithm.name}.json`; // Change the file extension if you want YAML.
//         const algorithmData = {
//             name: algorithm.name,
//             // Include other algorithm properties you want to export.
//         };
//         const algorithmJson = JSON.stringify(algorithmData, null, 2); // Indent for readability.
//         fs.writeFileSync(fileName, algorithmJson, 'utf8');
//         console.log(`Exported ${algorithm.name} to ${fileName}`);
//     }
//     console.log('Export completed successfully.');
// };
// // Usage example:
// const sourceEnv = 'https://source-environment-url';
// const outputDirectory = '/path/to/output/directory';
// exportAlgorithms(sourceEnv, outputDirectory);
