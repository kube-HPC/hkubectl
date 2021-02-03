const formatSize = require('pretty-bytes');
const get = require('lodash.get');
const chalk = require('chalk');
const Repository = require('../../helpers/dataSource/Repository');
const { api: client } = require('../../helpers/clients');
const { log } = require('../../helpers/output');

const handleSync = async () => {
    const cwd = process.cwd();
    const hkubeFile = await Repository.readHkubeFile(cwd);
    let response = null;
    try {
        response = await client.post(
            `datasource/${hkubeFile.repositoryName}/sync`
        );
    }
    catch (e) {
        e.code && log(chalk.red`sync failed! ${e.code}`);
        const message = get(e, 'response.data.error.message');
        message && log(chalk.red(message));
        return null;
    }
    const { avgFileSize, totalSize } = response.data;
    log({
        ...response.data,
        avgFileSize: formatSize(avgFileSize),
        totalSize: formatSize(totalSize)
    });
    return null;
};

const sync = {
    command: 'sync',
    description: 'should be called after push updates to git, creates a new version entry on the datasource service',
    options: {},
    builder: {},
    handler: handleSync
};

module.exports = { handleSync, sync };
