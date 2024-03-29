const mimeTypes = require('mime-types');
const { Repository: _Repository, createFileMeta, glob } = require('@hkube/datasource-utils');
const fse = require('fs-extra');
const get = require('lodash.get');
const { default: simpleGit } = require('simple-git');
const { cosmiconfigSync } = require('cosmiconfig');
/**
 * @typedef {import('@hkube/datasource-utils').LocalFileMeta} LocalFileMeta
 */
class Repository extends _Repository {
    /**
     * @param {string} repositoryName
     * @param {string} rootDir
     */
    constructor(repositoryName, rootDir, dirName) {
        super(repositoryName, rootDir, dirName);
        this.dirName = dirName || repositoryName;
        this.gitClient = simpleGit({ baseDir: this.cwd });
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

    static async readHkubeFile() {
        const searchResults = cosmiconfigSync('hkube', { searchPlaces: ['.dvc/hkube'] }).search();
        if (searchResults && searchResults.config) {
            return searchResults.config;
        }
        throw new Error('missing hkube file, you must be inside an hkube Datasource directory');
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
