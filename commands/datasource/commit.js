const { parse } = require('path');
const Repository = require('../../helpers/dataSource/Repository');
const { handleSync } = require('./sync');

const commit = {
    command: 'commit',
    description: 'prepares dvc files, commit changes to git and pushes',
    options: {
        message: {
            demandOption: true,
            describe: 'a commit message',
            type: 'string',
            alias: ['m']
        },
    },
    builder: {},
    handler: async ({ m: message }) => {
        const cwd = process.cwd();
        const hkubeFile = await Repository.readHkubeFile(cwd);
        const { dir, name } = parse(cwd);
        const repo = new Repository(hkubeFile.repositoryName, dir, name);
        await repo.prepareDvcFiles();
        await repo.commit(message);
        await repo.push();
        return handleSync();
    }
};

module.exports = { commit };
