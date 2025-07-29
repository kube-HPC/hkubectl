require('./polyfills');
const yargs = require('yargs');
const chalk = require('chalk');
const { readConfig } = require('./helpers/config');
const { config } = require('./builders/config');
const { exec } = require('./builders/exec');
const { exportAll } = require('./builders/export');
const { exportAlgorithms } = require('./builders/exportAlgorithms');
const { exportPipelines } = require('./builders/exportPipelines');
const { importAll } = require('./builders/import');
const { importAlgorithms } = require('./builders/importAlgorithms');
const { importPipelines } = require('./builders/importPipelines');
const algorithms = require('./builders/algorithm');
const pipelines = require('./builders/pipeline');
const dryRun = require('./builders/dry-run');
const sync = require('./builders/sync');
const { dataSource } = require('./builders/dataSource');
const { setupClient } = require('./helpers/clients');
const syncthing = require('./helpers/syncthing/syncthing.js');

global.args = {};
const handleSignals = () => {
    process.on('SIGINT', async () => {
        await syncthing.remove();
        process.exit(0);
    });
    process.on('exit', () => {
    });
};
const main = async () => {
    handleSignals();

    const configFile = await readConfig();

    yargs.config(configFile);
    yargs.command(exec);
    yargs.command(exportAll);
    yargs.command(exportAlgorithms);
    yargs.command(exportPipelines);
    yargs.command(importAll);
    yargs.command(importAlgorithms);
    yargs.command(importPipelines);
    yargs.command(algorithms);
    yargs.command(pipelines);
    yargs.command(dryRun);
    yargs.command(sync);
    yargs.command(config);
    yargs.command(dataSource);
    yargs.options('rejectUnauthorized', {
        description: 'set to false to ignore certificate signing errors. Useful for self signed TLS certificate',
        type: 'boolean'
    });
    yargs.options('endpoint', {
        description: 'url of hkube api endpoint',
        type: 'string'
    });
    yargs.options('pathPrefix', {
        description: 'path prefix url of hkube api endpoint',
        type: 'string',
        default: '/hkube/api-server/'
    });
    yargs.options('dataSourcePathPrefix', {
        description: 'path prefix url of hkube api endpoint',
        type: 'string',
        default: '/hkube/datasources-service/'
    });
    yargs.options('verbose', {
        description: 'verbose logging',
        type: 'boolean'
    });
    yargs.options('username', {
        description: 'kc username',
        type: 'string',
        describe: false
    });
    yargs.options('password', {
        description: 'kc password',
        type: 'string',
        describe: false
    });
    yargs.options('json', {
        description: 'output json to stdout',
        type: 'boolean',
        alias: ['j']
    })
        .recommendCommands()
        .showHelpOnFail()
        .help()
        .epilog(chalk.bold('for more information visit http://hkube.org'))
        .completion();

    yargs.middleware((args) => {
        global.args = args;
        setupClient(global.args);
    });
    const args = await yargs.argv;
    if (!args._[0]) {
        if (args.endpoint) {
            yargs.showHelp();
            process.stdin.pause();
        }
        else {
            config.handler(args);
        }
    }
};

module.exports = main;
