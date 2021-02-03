const { parse } = require('path');
const formatSize = require('pretty-bytes');
const Repository = require('../../helpers/dataSource/Repository');
const { api: client } = require('../../helpers/clients');
const { log } = require('../../helpers/output');

const handleSync = async () => {
    const cwd = process.cwd();
    const hkubeFile = await Repository.readHkubeFile(cwd);
    const response = await client.post(`datasource/${hkubeFile.repositoryName}/sync`);
    const { avgFileSize, totalSize } = response.data;
    log({
        ...response.data,
        avgFileSize: formatSize(avgFileSize),
        totalSize: formatSize(totalSize)
    });
    return null;
};

const push = {
    command: 'push',
    description: 'calls dvc, git push and hkube datasource hkube datasource prepare and sync',
    options: {},
    builder: {},
    handler: async () => {
        const cwd = process.cwd();
        const hkubeFile = await Repository.readHkubeFile(cwd);
        const { dir } = parse(cwd);
        const repo = new Repository(hkubeFile.repositoryName, dir);
        await repo.push();
        return handleSync();
    }
};

const sync = {
    command: 'sync',
    description: 'should be called after push updates to git, creates a new version entry on the datasource service',
    options: {},
    builder: {},
    handler: handleSync
};

const prepare = {
    command: 'prepare',
    description: 'should be called before commiting to git, scans the directory and updates all the.dvc files',
    options: {},
    builder: {},
    handler: async () => {
        const cwd = process.cwd();
        const { dir, name } = parse(cwd);
        const hkubeFile = await Repository.readHkubeFile(cwd);
        const repo = new Repository(hkubeFile.repositoryName, dir, name);
        await repo.prepareDvcFiles();
        return null;
    }
};

module.exports = { sync, prepare, push };
