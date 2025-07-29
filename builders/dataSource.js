const commands = require('../commands/datasource');

const dataSource = {
    command: 'datasource <command>',
    description: 'Execution pipelines as raw or stored',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
            process.stdin.pause();
        });
        return yargs;
    },
    handler: () => { }
};

module.exports = { dataSource };
