/* eslint-disable no-param-reassign */
const archiver = require('archiver');
const walk = require('ignore-walk');
const tempy = require('tempy');
const fs = require('fs-extra');
const path = require('path');
const zipDirectory = async (source, out, options) => {
    if (!options && typeof out === 'object') {
        options = out;
    }
    if (!options) {
        options = {};
    }
    const { spinner } = options;
    const archive = archiver('zip', { zlib: { level: 9 } });
    if (spinner) {
        archive.on('progress', p => {
            spinner.text = `zipped ${p.entries.processed} of ${p.entries.total}`;
        });
    }
    const zipName = options.tmpFile ? tempy.file({ extension: 'zip' }) : out;

    const stream = fs.createWriteStream(zipName);
    const files = await walk({
        path: source,
        ignoreFiles: ['.hkubeignore']
    });
    const fileData = files.map(f => ({ absolute: path.join(source, f), relative: f }));
    return new Promise((resolve, reject) => {
        archive
            .on('error', err => reject(err))
            .on('warning', err => console.warn(err))
            .pipe(stream);
        stream.on('close', () => resolve(zipName));
        fileData.forEach(f => archive.file(f.absolute, { name: f.relative }));
        archive.finalize();
    });
};

module.exports = {
    zipDirectory
};
