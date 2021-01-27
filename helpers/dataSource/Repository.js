const _glob = require('glob');
const mimeTypes = require('mime-types');
const fse = require('fs-extra');
const get = require('lodash.get');
const { default: simpleGit } = require('simple-git');
const DvcClient = require('./DvcClient');
const { createFileMeta } = require('./createFileMeta');

/**
 * @typedef {import('./types.d').FileMeta} FileMeta
 * @typedef {import('./types.d').LocalFileMeta} LocalFileMeta
 * @typedef {import('./types.d').NormalizedFileMeta} NormalizedFileMeta
 * @typedef {import('./types').DvcContent} DvcContent
 */

/** @type {(pattern: string, cwd: string) => Promise<string[]>} */
const glob = (pattern, cwd) => new Promise(
    (res, rej) => _glob(pattern, { cwd }, (err, matches) => (
        err ? rej(err) : res(matches)
    ))
);

class Repository {
    /**
     * @param {string} repositoryName
     * @param {string} rootDir
     */
    constructor(repositoryName, rootDir) {
        this.repositoryName = repositoryName;
        this.rootDir = rootDir;
        this.gitClient = simpleGit({ baseDir: this.cwd });
        this.dvc = new DvcClient(this.cwd);
    }

    get cwd() {
        return `${this.rootDir}/${this.repositoryName}`;
    }

    async push(commitMessage) {
        await this.dvc.push();
        await this.gitClient.add('.');
        const { commit } = await this.gitClient.commit(commitMessage);
        await this.gitClient.push();
        return commit;
    }

    _createFileMeta(currentMeta) {
        const { size, path: name } = currentMeta.outs[0];
        const mimetype = mimeTypes.lookup(name) || '';
        return createFileMeta({
            originalname: name,
            size,
            mimetype
        }, null, 'cli');
    }

    async prepareDvcFiles() {
        const dvcFiles = await glob('**/*.dvc', this.cwd);
        for await (const dvcPath of dvcFiles) {
            const dvcContent = await this.dvc.loadDvcContent(dvcPath, true);
            /** @type {LocalFileMeta} */
            let fileMeta = get(dvcContent, 'meta.hkube', {});
            if (dvcContent.outs[0].md5 !== get(dvcContent, 'meta.hkube.hash', null)) {
                const { path, ...generatedMeta } = this._createFileMeta(dvcContent);
                fileMeta = generatedMeta;
            }
            const metaFilePath = dvcPath.replace('.dvc', '.meta');
            if (await fse.pathExists(metaFilePath)) {
                const content = await fse.readFile(`${this.cwd}/${metaFilePath}`);
                fileMeta.meta = content.toString('utf8');
            }
            await this.dvc.enrichMeta(dvcPath, dvcContent, 'hkube', fileMeta);
        }
    }
}

module.exports = Repository;
