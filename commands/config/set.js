const path = require('path');
const prettyjson = require('prettyjson');
const fs = require('fs-extra')
const { resolveConfigPath } = require('../../helpers/config');

const handler = async ({ key, value }) => {
    const configPath = await resolveConfigPath(true);
    const config = await fs.readJson(configPath);
    const newConfig = { ...config, [key]: value };
    await fs.writeJson(configPath, newConfig, { spaces: 2 });
    return newConfig;
}



module.exports = {
    command: 'set [key] [value]',
    description: 'Sets configuration options.',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await handler(argv);
        console.log(prettyjson.render(ret));
    }
}
