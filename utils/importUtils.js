const { post } = require('../helpers/request-helper');
const { AuthManager } = require('../helpers/authentication/auth-manager');

async function importAlgorithms(argv, algorithmData, overwrite) {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const algoPath = 'store/algorithms';
    const response = await post({
        ...argv,
        path: `${algoPath}?overwrite=${overwrite}`,
        body: algorithmData,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    response.result.forEach((result) => {
        if (result.error) {
            console.error(result.error.message);
        }
        else {
            console.log(`Successfully imported ${result.name}`);
        }
    });
    auth.stop();
}

async function importPipelines(argv, pipelinedata, overwrite) {
    const { endpoint, rejectUnauthorized, username, password } = argv;
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    this._kc_token = await auth.getToken();
    const pipePath = 'store/pipelines';
    const response = await post({
        ...argv,
        path: `${pipePath}?overwrite=${overwrite}`,
        body: pipelinedata,
        headers: { Authorization: `Bearer ${this._kc_token}` }
    });
    response.result.forEach((result) => {
        if (result.error) {
            console.error(result.error.message);
        }
        else {
            console.log(`Successfully imported ${result.name}`);
        }
    });
    auth.stop();
}

const replaceValsInFile = (fileContent, Mappings) => {
    const replacedCounts = {};
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
            const [oldValue, newValue] = mapping.split('^');
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
    importPipelines,
    replaceValsInFile
};
