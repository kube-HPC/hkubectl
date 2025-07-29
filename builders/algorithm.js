const commands = require('../commands/store/algorithms');

const algorithms = {
    command: 'algorithm <command>',
    description: 'Manage loaded algorithms',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
            process.stdin.pause();
        });
        return yargs;
    },
    handler: () => { }
};

module.exports = algorithms;
