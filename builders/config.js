const inquirer = require('inquirer');
const chalk = require('chalk');
const https = require('https');
const axios = require('axios');
const ora = require('ora');
const commands = require('../commands/config/index.js');
const { writeValues, resolveConfigPath } = require('../helpers/config');
const { get, post } = require('../helpers/request-helper');
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
const ensureTrailingSlash = (url) => url.replace(/\/?$/, '/');

const handler = async ({ endpoint, rejectUnauthorized, ...rest }) => {
    console.log(chalk.bold('Please answer a few questions to configure Hkube cli'));
    let answers2;
    const answers1 = await inquirer.prompt([
        {
            type: 'input',
            name: 'endpoint',
            message: 'Enter the URL of your Hkube cluster',
            default: endpoint,
            validate: (value) => {
                return urlRegex.test(value) || 'Please enter a valid URL';
            }
        },
        {
            type: 'confirm',
            name: 'rejectUnauthorized',
            message: 'Verify SSL certificates? (enter false for self signed certificates)',
            default: rejectUnauthorized
        }
    ]);
    const kcEndpoint = ensureTrailingSlash(answers1.endpoint);
    const keycloakUrl = `${kcEndpoint}hkube/keycloak/realms/master/.well-known/openid-configuration`;
    let keycloakExists = false;
    try {
        const kcRes = await axios.get(keycloakUrl, {
            timeout: 2000,
            httpsAgent: new https.Agent({
                rejectUnauthorized: answers1.rejectUnauthorized
            })
        });
        if (kcRes.data) {
            keycloakExists = true;
        }
    }
    catch (error) {
        // Keycloak doesnt exist, flag stays false.
    }

    if (keycloakExists) {
        answers2 = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Enter your keycloak username',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your keycloak password',
                mask: '*'
            }
        ]);
    }
    const answers = { ...answers1, ...answers2 };
    await writeValues(answers);
    // const answers = { endpoint, rejectUnauthorized };
    console.log(`Values saved in ${await resolveConfigPath()}`);
    let res = await post({ endpoint: answers.endpoint, rejectUnauthorized: answers.rejectUnauthorized, path: '/auth/login', body: { username: answers.username, password: answers.password } });
    if (!res || !res.result) {
        if (res.error.message) {
            console.log(chalk.red(`Login failed - ${res.error.message}`));
        }
        return;
    }
    const spinner = ora({ text: 'Validating config...', spinner: 'line' }).start();
    res = await get({ ...answers, path: '/storage/info', timeout: 1000, headers: { Authorization: `Bearer ${res.result.token}` } });
    if (!res || !res.result) {
        spinner.fail();
        console.error(chalk`{red failed} to connect to api-server at ${answers.endpoint}`);
        if (res.error && res.error.message) {
            console.error(chalk`{red Error is}: ${res.error.message}`);
        }
    }
    else {
        spinner.succeed();
        console.log(chalk`{green Successfully} configured to {bold ${answers.endpoint} }`);
    }
    console.log(chalk`Run {bold ${rest.$0} config} to run the configuration wizard again`);
    console.log(chalk`Run {bold ${rest.$0}} without arguments to get help`);
};
const config = {
    command: ['config [command]'],
    description: 'Set configuration options for hkubectl',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });
        return yargs;
    },
    handler
};

module.exports = {
    config
};
