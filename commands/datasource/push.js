const { parse } = require('path');
const Repository = require('../../helpers/dataSource/Repository');
const { handleSync } = require('./sync');

const push = {
    command: 'push',
    description: 'calls dvc, git push and hkube datasource hkube datasource prepare and sync',
    options: {},
    builder: {},
    handler: async () => {
        const cwd = process.cwd();
        const hkubeFile = await Repository.readHkubeFile();
        const { dir, name } = parse(cwd);
        const repo = new Repository(hkubeFile.repositoryName, dir, name);
        await repo.push();
        return handleSync();
    }
};

module.exports = { push };
