const commands = require('../commands/localRun');

const localRun = {
    command: 'localRun <command>',
    description: 'run pipeline locally',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });

        return yargs;
    },
    handler: () => { }
};

module.exports = localRun;
