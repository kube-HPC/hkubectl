const { parse } = require('path');
const Repository = require('../../helpers/dataSource/Repository');

const prepare = {
    command: 'prepare',
    description: 'should be called before commiting to git, scans the directory and updates all the.dvc files',
    options: {},
    builder: {},
    handler: async () => {
        const cwd = process.cwd();
        const { dir, name } = parse(cwd);
        const hkubeFile = await Repository.readHkubeFile();
        const repo = new Repository(hkubeFile.repositoryName, dir, name);
        await repo.prepareDvcFiles();
        return null;
    }
};

module.exports = { prepare };
