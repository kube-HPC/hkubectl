const { post } = require('../helpers/request-helper');

async function importAlgorithms(argv, algorithmData) {
    const algoPath = 'store/algorithms';
    const response = await post({
        ...argv,
        path: algoPath,
        body: algorithmData,
    });
    response.result.forEach((result) => {
        if (result.error) {
            console.error(result.error.message);
        }
        else {
            console.log(`Successfully imported ${result.name}`);
        }
    });
}

async function importPipelines(argv, pipelinedata) {
    const pipePath = 'store/pipelines';
    const response = await post({
        ...argv,
        path: pipePath,
        body: pipelinedata,
    });
    response.result.forEach((result) => {
        if (result.error) {
            console.error(result.error.message);
        }
        else {
            console.log(`Successfully imported ${result.name}`);
        }
    });
}

async function importDataHandler(argv, storePath, data) {
    const response = await post({
        ...argv,
        path: storePath,
        body: data,
    });

    response.result.forEach((result) => {
        if (result.error) {
            console.error(result.error.message);
        }
        else {
            console.log(`Successfully imported ${result.name}`);
        }
    });
}

const replaceValsInFile = (fileContent, Mappings) => {
    const replacedCounts = {};
    const codeRegex = new RegExp('Code', 'g');
    // eslint-disable-next-line no-param-reassign
    fileContent = fileContent.replace(codeRegex, 'Image');

    Object.entries(Mappings).forEach(([oldValue, newValue]) => {
        const regex = new RegExp(oldValue, 'g');
        const replacements = (fileContent.match(regex) || []).length;
        replacedCounts[oldValue] = replacements;

        // eslint-disable-next-line no-param-reassign
        fileContent = fileContent.replace(regex, newValue);
    });

    return { fileContent, replacedCounts };
};

function parseUserVals(userValues) {
    if (userValues) {
        const mappings = userValues.split(';');
        const valuesMap = {};

        mappings.forEach(mapping => {
            const [oldValue, newValue] = mapping.split('=>');
            if (oldValue && newValue) {
                valuesMap[oldValue.trim()] = newValue.trim();
            }
        });

        return valuesMap;
    }
    return null;
}

module.exports = {
    importAlgorithms,
    parseUserVals,
    importDataHandler,
    importPipelines,
    replaceValsInFile
};
