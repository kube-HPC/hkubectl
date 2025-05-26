// const axios = require('axios');
const { post } = require('../request-helper');

class AuthManager {
    constructor({ username, password, endpoint, rejectUnauthorized, authUrl = '/auth/login', refreshInterval = 45 }) {
        this.username = username;
        this.password = password;
        this.endpoint = endpoint;
        this.rejectUnauthorized = rejectUnauthorized;
        this.authUrl = authUrl;

        this.refreshInterval = refreshInterval; // seconds
        this.token = null;
        this.expiresAt = 0;
        this.refreshTimer = null;
    }

    async init() {
        if (this.username) {
            await this._login();
            this._startRefreshLoop();
        }
    }

    async getToken() {
        if (this.username) {
            const now = Math.floor(Date.now() / 1000);
            if (now >= this.expiresAt - 10) {
                await this._login(); // proactively refresh if close to expiry
            }
            return this.token;
        }
        return undefined;
    }

    async _login() {
        try {
            const data = await post({
                endpoint: this.endpoint,
                rejectUnauthorized: this.endpoint,
                path: this.authUrl,
                body: { username: this.username, password: this.password }
            });

            const now = Math.floor(Date.now() / 1000);

            this.token = data.result.data.access_token;
            this.expiresAt = now + data.result.data.expires_in;
            this.refreshToken = data.result.data.refresh_token;
        }
        catch (err) {
            console.error(`login error - ${err}`);
        }
    }

    _startRefreshLoop() {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
        this.refreshTimer = setInterval(async () => {
            try {
                await this._login();
            }
            catch (err) {
                console.warn('[AuthManager] Periodic login failed, will retry on next getToken()');
            }
        }, this.refreshInterval * 1000);
    }

    stop() {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
    }
}

module.exports = {
    AuthManager
};
