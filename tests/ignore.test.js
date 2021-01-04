const { expect } = require('chai');
var AdmZip = require('adm-zip');
const path = require('path');
const {zipDirectory} = require('../helpers/zipper')

describe('ignore file', () => {
    it('do not ignore if no file', async () => {
        const zipFileName = await zipDirectory(path.join(__dirname,'./testData/ignores/noIgnore'),{tmpFile: true});
        const zip = new AdmZip(zipFileName);
        const files = zip.getEntries();
        expect(files).to.have.lengthOf(3)
    });
    it('ignore files in .hkubeignore', async () => {
        const zipFileName = await zipDirectory(path.join(__dirname,'./testData/ignores/ignore'),{tmpFile: true});
        const zip = new AdmZip(zipFileName);
        const files = zip.getEntries();
        expect(files).to.have.lengthOf(3)
    });
    it('ignore files in .hkubeignore recursively', async () => {
        const zipFileName = await zipDirectory(path.join(__dirname,'./testData/ignores/ignoreRecursive'),{tmpFile: true});
        const zip = new AdmZip(zipFileName);
        const files = zip.getEntries();
        expect(files).to.have.lengthOf(2)
    });
});