const fse = require('fs-extra');
const { parse } = require('path');
const formatSize = require('pretty-bytes');
const Repository = require('../../helpers/dataSource/Repository');
const { api: client } = require('../../helpers/clients');
const { log } = require('../../helpers/output');

/** @returns {Promise<{repositoryName: string}>} */
const readHkubeFile = async (cwd) => {
    const hkubeFilePath = `${cwd}/.dvc/hkube`;
    const hasHkubeFile = await fse.pathExists(hkubeFilePath);
    if (!hasHkubeFile) {
        throw new Error('missing hkube file in .dvc directory');
    }
    const stringifiedHkubeFile = await fse.readFile(hkubeFilePath);
    return JSON.parse(stringifiedHkubeFile.toString('utf-8'));
};

const push = {
    command: 'push',
    description: 'calls dvc, git push and hkube datasource hkube datasource prepare and sync',
    options: {},
    builder: {},
    handler: async () => {
        const cwd = process.cwd();
        const hkubeFile = await readHkubeFile(cwd);
        const { dir } = parse(cwd);
        const repo = new Repository(hkubeFile.repositoryName, dir);
        await repo.push();
        const response = await client.post(`datasource/${hkubeFile.repositoryName}/sync`);
        log(response.data);
        return null;
    }
};

const sync = {
    command: 'sync',
    description: 'should be called after push updates to git, creates a new version entry on the datasource service',
    options: {},
    builder: {},
    handler: async () => {
        const cwd = process.cwd();
        const hkubeFile = await readHkubeFile(cwd);
        const response = await client.post(`datasource/${hkubeFile.repositoryName}/sync`);
        const { avgFileSize, totalSize } = response.data;
        log({
            ...response.data,
            avgFileSize: formatSize(avgFileSize),
            totalSize: formatSize(totalSize)
        });
        return null;
    }
};

const prepare = {
    command: 'prepare',
    description: 'should be called before commiting to git, scans the directory and updates all the.dvc files',
    options: {},
    builder: {},
    handler: async () => {
        const cwd = process.cwd();
        const { dir } = parse(cwd);
        const hkubeFile = await readHkubeFile(cwd);
        const repo = new Repository(hkubeFile.repositoryName, dir);
        await repo.prepareDvcFiles();
        return 0;
    }
};

module.exports = { sync, prepare, push };
