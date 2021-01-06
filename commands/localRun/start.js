const localRun = require('../../helpers/localrun/index');
const getHandler = async (argv) => {
    localRun.init(argv);
};

module.exports = {
    command: 'start',
    description: 'start local run server',
    options: {
    },
    builder: {
        port: {
            demandOption: false,
            describe: 'port for starting local run server',
            type: 'string',
            alias: ['p'],
            default: '3000'
        },
    },
    handler: async (argv) => {
        await getHandler(argv);
    }
};
