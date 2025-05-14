const path = require('path');
const getPort = require('get-port');
const readline = require('readline');
const { startClient, releaseTunnel } = require('../../helpers/tcpTunnel/client');
const agentSyncIngressPath = '/hkube/sync/sync';
const agentRestIngressPath = '/hkube/sync/ui';
const syncthing = require('../../helpers/syncthing/syncthing.js');
const { events } = require('../../helpers/consts');
const { lock } = require('../../helpers/locks');
const { post, get, del } = require('../../helpers/request-helper');

const cursorUpCleanLine = '\x1b[1A\x1b[2K';
// eslint-disable-next-line no-unused-vars
const body = {};
let lastLineBeforeApply;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const _finishedUpdate = () => {
    releaseTunnel();
    console.log('finishing update process, releasing tunnel client and exiting.');
};

const printScrollingLine = (actionLog, addSelectMsg = true, saveLastMessage = true, addTimestamp = true) => {
    const timestamp = new Date().toLocaleString();
    let logMessage;
    if (addTimestamp) logMessage = `[${timestamp}] ${actionLog}`;
    else logMessage = actionLog;
    if (addSelectMsg) {
        logMessage = `${logMessage}     Please select an option: `;
    }
    process.stdout.write(cursorUpCleanLine); // Move cursor up one line and clear it
    if (saveLastMessage) lastLineBeforeApply = `${logMessage}`;
    process.stdout.write(`${logMessage}\n`);
};

const startMenu = (printMenu = false) => {
    if (printMenu) {
        console.log('===========================================================');
        console.log('\nWelcome to the sync watch control menu:');
        console.log('1. Force apply changes on running algorithms ( Pods will be deleted)');
        console.log('2. Exit');
        console.log('Please select an option:   ');
        if (lastLineBeforeApply) console.log(lastLineBeforeApply);
    }

    rl.question('', (answer) => {
        const awaitCase1 = async () => {
            const res = await post({ endpoint: this._endpoint, rejectUnauthorized: this._rejectUnauthorized, path: '/auth/login', body: { username: this._username, password: this._password } });
            del({ endpoint: this._endpoint, rejectUnauthorized: this._rejectUnauthorized, path: `kubernetes/algorithms/pods/${this._algorithmName}`, headers: { Authorization: `Bearer ${res.result.token}` } });
            this.body.payload = { ...this.body.payload, syncTimeStamp: new Date().toLocaleTimeString() };
            this.body.options = JSON.stringify(this.body.options);
            this.body.payload = JSON.stringify(this.body.payload);
            post({ endpoint: this._endpoint, rejectUnauthorized: this._rejectUnauthorized, path: 'store/algorithms/apply', body: this.body, headers: { Authorization: `Bearer ${res.result.token}` } });
            startMenu(true);
        };
        switch (answer) {
        case '1':
            printScrollingLine('Pressed 1, restarting pods, update in progress...', false, false, false);
            awaitCase1();
            break;
        case '2':
            process.stdout.write(cursorUpCleanLine); // Move cursor up one line and clear it
            printScrollingLine('Exiting...', false, false);
            syncthing._proc.kill();
            _finishedUpdate();
            break;
        default:
            process.stdout.write(cursorUpCleanLine); // Move cursor up one line and clear it
            printScrollingLine('Invalid option. Please try again. ', true, false);
            // eslint-disable-next-line no-unused-vars
            startMenu();
            break;
        }
    });
};

const watchHandler = async ({ endpoint, rejectUnauthorized, username, password, algorithmName, folder, bidi }) => {
    this._endpoint = endpoint;
    this._username = username;
    this._password = password;
    const endpointParts = endpoint.match(/(https?:\/\/)(.*)/);
    const [, urlPrefix, baseUrl] = endpointParts;
    this._rejectUnauthorized = rejectUnauthorized;
    this._algorithmName = algorithmName;
    this.body = { ...this.body, payload: { name: algorithmName } };
    this.body = { ...this.body, options: { forceUpdate: true } };
    let res = await post({ endpoint, rejectUnauthorized, path: '/auth/login', body: { username, password } });
    this._token = res.result.token;
    res = await get({ endpoint: this._endpoint, rejectUnauthorized: this._rejectUnauthorized, path: `store/algorithms/${algorithmName}`, headers: { Authorization: `Bearer ${res.result.token}` } });
    if (res.error && res.error.message) {
        console.error(`error getting algorithm ${algorithmName}. Error: ${res.error.message}`);
        return;
    }
    this._syncPath = urlPrefix + path.join(baseUrl, agentSyncIngressPath); // avoids removing the '//' after the protocol
    const tunnelUrl = this._syncPath.replace('http', 'ws'); // support both ws and wss
    try {
        const fullPath = path.resolve(folder);
        console.log(`watching folder ${fullPath}`);
        let tunnelPort;
        const unlock = await lock('tunnelPort');
        try {
            tunnelPort = await getPort({ port: 22001 });
            await startClient(tunnelUrl, 'localhost:22000', tunnelPort, { rejectUnauthorized });
        }
        finally {
            unlock();
        }
        this._syncPath = urlPrefix + path.join(baseUrl, agentRestIngressPath);
        await syncthing.start({ algorithmName, tunnelUrl: this._syncPath, tunnelPort, rejectUnauthorized: this._rejectUnauthorized });
        await syncthing.addFolder({ path: fullPath, algorithmName, bidi });
        syncthing.on('event', data => {
            if (data.folder !== algorithmName) {
                return;
            }
            switch (data.type) {
            case events.FolderSummary:
                if (!(data.name === 'local')) {
                    printScrollingLine(`Algorithm ${data.folder} update started `);
                }
                break;
            case events.FolderCompletion:
                if (!(data.name === 'local')) {
                    printScrollingLine(`Algorithm ${data.folder} update done   `);
                }
                break;
            default:
                break;
            }
        });
        startMenu(true);
    }
    catch (error) {
        console.error(`error connecting sync server. Error: ${error.message}`);
    }
};

module.exports = {
    command: 'watch',
    description: 'watch a local folder, navigate menu to apply sync changes at will',
    options: {
    },
    builder: {
        algorithmName: {
            demandOption: true,
            describe: 'The name of the algorithm to sync data into',
            type: 'string',
            alias: ['a']
        },
        folder: {
            demandOption: false,
            describe: 'local folder to sync.',
            default: './',
            type: 'string',
            alias: ['f']
        },
        bidirectional: {
            demandOption: false,
            describe: 'Sync files in both ways',
            default: false,
            type: 'boolean',
            alias: ['bidi']
        }
    },
    handler: async (argv) => {
        await watchHandler(argv);
    }
};
