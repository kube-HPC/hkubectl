const { sync } = require('./sync');
const { push } = require('./push');
const { prepare } = require('./prepare');
const { commit } = require('./commit');

module.exports = { sync, prepare, push, commit };
