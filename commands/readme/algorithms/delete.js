const { del } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const delHandler = async ({ endpoint, rejectUnauthorized, name }) => {
    const path = `store/algorithms/${name}`;
    return del({
        endpoint,
        rejectUnauthorized,
        path
    });
};

module.exports = {
    command: 'delete <name>',
    description: 'Deletes an algorithm by name',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await delHandler(argv);
        log(ret);
    }
};
