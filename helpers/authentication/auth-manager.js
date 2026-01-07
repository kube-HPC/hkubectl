const axios = require('axios').default;
const https = require('https');
const { URL } = require('url');
const { post } = require('../request-helper');

const KEYCLOAK_WELL_KNOWN_PATH = 'hkube/keycloak/realms/master/.well-known/openid-configuration';

class AuthManager {
    constructor({ username, password, endpoint, rejectUnauthorized, authUrl = '/auth/login', refreshInterval = 45, autoDetect = true, detectTtlSeconds = 300 }) {
        this.username = username;
        this.password = password;
        this.endpoint = endpoint;
        this.rejectUnauthorized = rejectUnauthorized;
        this.authUrl = authUrl;

        this.refreshInterval = refreshInterval; // seconds
        this.autoDetect = autoDetect;
        this.detectTtlSeconds = detectTtlSeconds;

        this.token = null;
        this.expiresAt = 0;
        this.refreshTimer = null;

        this._authAvailable = null;
        this._authCheckedAt = 0;
        this._warnedAuthDisabled = false;
    }

    async init() {
        if (!this.username) {
            return;
        }
        if (this.autoDetect) {
            const available = await this._isAuthAvailable();
            if (!available) {
                this._disableAuth();
                return;
            }
        }
        const ok = await this._login();
        if (ok) {
            this._startRefreshLoop();
        }
    }

    async getToken() {
        if (!this.username) {
            return undefined;
        }
        if (this.autoDetect) {
            const available = await this._isAuthAvailable();
            if (!available) {
                this._disableAuth();
                return undefined;
            }
        }
        const now = Math.floor(Date.now() / 1000);
        if (now >= this.expiresAt - 10) {
            await this._login(); // proactively refresh if close to expiry
        }
        return this.token || undefined;
    }

    async _isAuthAvailable() {
        const now = Date.now();
        if (this._authAvailable !== null && now - this._authCheckedAt < this.detectTtlSeconds * 1000) {
            return this._authAvailable;
        }
        const base = this.endpoint && this.endpoint.endsWith('/') ? this.endpoint : `${this.endpoint}/`;
        const url = new URL(KEYCLOAK_WELL_KNOWN_PATH, base).toString();
        try {
            const res = await axios.get(url, {
                timeout: 2000,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: this.rejectUnauthorized
                })
            });
            this._authAvailable = Boolean(res && res.data);
        }
        catch (error) {
            this._authAvailable = false;
        }
        this._authCheckedAt = now;
        return this._authAvailable;
    }

    _disableAuth() {
        this.stop();
        this.token = null;
        this.expiresAt = 0;
        if (!this._warnedAuthDisabled) {
            this._warnedAuthDisabled = true;
            // console.warn('[AuthManager] Keycloak/auth not detected on endpoint; skipping login');
        }
    }

    async _login() {
        try {
            const data = await post({
                endpoint: this.endpoint,
                rejectUnauthorized: this.rejectUnauthorized,
                path: this.authUrl,
                body: { username: this.username, password: this.password }
            });

            if (!data || !data.result || !data.result.data || !data.result.data.access_token) {
                this.token = null;
                this.expiresAt = 0;
                return false;
            }

            const now = Math.floor(Date.now() / 1000);
            this.token = data.result.data.access_token;
            this.expiresAt = now + data.result.data.expires_in;
            this.refreshToken = data.result.data.refresh_token;
            return true;
        }
        catch (err) {
            console.error(`login error - ${err}`);
            this.token = null;
            this.expiresAt = 0;
            return false;
        }
    }

    _startRefreshLoop() {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
        this.refreshTimer = setInterval(async () => {
            try {
                await this._login();
            }
            catch (err) {
                // console.warn('[AuthManager] Periodic login failed, will retry on next getToken()');
            }
        }, this.refreshInterval * 1000);
    }

    stop() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
    }
}

module.exports = {
    AuthManager
};
