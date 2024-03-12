const ws = require('websocket-stream');
const { createServer } = require('net');
const pipe = require('pump');

const onError = (err) => {
    if (err) {
        if (!err.message.includes('premature close')) { // happens from time to time but doesn't affect dyncing
            console.error(`[Tunnel] ${err.message || err}`);
        }
    }
};

let _tcpServerInstance;

const startClient = (tunnel, target, port, options) => {
    return new Promise((resolve) => {
        const tcpServer = createServer((local) => {
            const remote = ws(tunnel + (tunnel.slice(-1) === '/' ? '' : '/') + target, options);
            pipe(remote, local, onError);
            pipe(local, remote, onError);
        });
        tcpServer.on('error', onError);
        tcpServer.listen(port, onError);
        _tcpServerInstance = tcpServer;
        resolve();
    });
};

async function releaseTunnel() {
    try {
        if (_tcpServerInstance) {
            await new Promise((resolve, reject) => {
                _tcpServerInstance.close((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log('Socket tunnel client released.');
                        resolve();
                        process.kill(process.pid, 'SIGTERM');
                    }
                });
            });
        }
        else {
            console.log('No active tunnel client to release.');
        }
    }
    catch (error) {
        console.error('Error releasing socket tunnel client:', error);
    }
}

module.exports = { startClient, releaseTunnel };
