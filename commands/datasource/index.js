const fse = require('fs-extra');
const { parse } = require('path');
const Repository = require('../../helpers/dataSource/Repository');

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

const sync = {
    command: 'sync',
    description: 'should be called after push updates to git, creates a new version entry on the datasource service',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        console.log(argv);
        return 0;
    }
};

const prepare = {
    command: 'prepare',
    description: 'should be called before commiting to git, scans the directory and updates all the.dvc files',
    options: {

    },
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

module.exports = { sync, prepare };
