const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const merge = require('lodash.merge');
const FormData = require('form-data');
const ora = require('ora');
const expandTilde = require('expand-tilde');
const formatSize = require('pretty-bytes');
const { AuthManager } = require('../../../helpers/authentication/auth-manager');
const { postFile, getUntil, post, get } = require('../../../helpers/request-helper');
const { zipDirectory } = require('../../../helpers/zipper');
const { buildDoneEvents } = require('../../../helpers/consts');
const applyPath = 'store/algorithms/apply';

const waitForBuild = async ({ endpoint, rejectUnauthorized, auth, name, setCurrent, applyRes }) => {
    const error = applyRes.error || applyRes.result.error;
    if (error) {
        console.error(error.message || error);
        return { buildStatus: buildDoneEvents.failed };
    }
    const { buildId } = applyRes.result.result;
    let buildStatus = buildDoneEvents.completed;

    if (buildId) {
        // wait for build
        const spinner = ora({ text: `build ${buildId} in progress.`, spinner: 'line' }).start();
        let lastStatus = '';
        const buildResult = await getUntil({ endpoint, rejectUnauthorized, path: `builds/status/${buildId}`, auth,
        }, (res) => {
            if (lastStatus !== res.result.status) {
                spinner.text = res.result.status;
            }
            lastStatus = res.result.status;
            return (Object.values(buildDoneEvents).includes(res.result.status));
        }, 1000 * 60 * 10);
        const { algorithmImage, version, semver, status } = buildResult.result;
        let newVersion = version || semver;
        let versionId = null;
        this._kc_token = await auth.getToken();
        if (!newVersion) {
            const allVersions = await get({ endpoint, rejectUnauthorized, path: `versions/algorithms/${name}`, headers: { Authorization: `Bearer ${this._kc_token}` }
            });
            const foundVersion = allVersions.result.find(v => v.buildId === buildId);
            if (foundVersion) {
                newVersion = foundVersion.semver;
                versionId = foundVersion.version;
            }
        }
        if (status === buildDoneEvents.completed) {
            spinner.succeed();
            if (setCurrent) {
                console.log(`Setting version ${newVersion} as current`);
                await post({
                    endpoint,
                    rejectUnauthorized,
                    path: 'versions/algorithms/apply',
                    body: {
                        name,
                        image: algorithmImage,
                        version: versionId,
                        force: true
                    },
                    headers: { Authorization: `Bearer ${this._kc_token}` }
                });
            }
            else {
                console.log(`New version ${newVersion} created. Set it as current from the dashboard`);
            }
        }
        else {
            spinner.fail();
            buildStatus = status;
            console.log(`built ${buildId} ${status}`);
        }
    }
    return { buildStatus };
};

const readFile = (file) => {
    let result; let
        error;
    try {
        result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    }
    catch (e) {
        error = e.message;
    }
    return { error, result };
};

const adaptFileData = (fileData) => {
    const {
        name,
        env,
        image,
        algorithmImage,
        version,
        code,
        resources,
        algorithmEnv,
        workerEnv,
        minHotWorkers,
        nodeSelector,
        baseImage,
        options,
        ...rest
    } = fileData || {};
    const { cpu, gpu, mem } = resources || {};
    return {
        name,
        env,
        code: code || {},
        version,
        algorithmImage: image || algorithmImage,
        baseImage,
        options,
        cpu,
        gpu,
        mem,
        algorithmEnv,
        workerEnv,
        minHotWorkers,
        nodeSelector,
        ...rest
    };
};

const adaptCliData = (cliData) => {
    const { env,
        image,
        ver,
        cpu,
        gpu,
        mem,
        algorithmEnv,
        workerEnv,
        codePath,
        codeEntryPoint,
        baseImage,
        options,
        mounts
    } = cliData || {};
    return {
        env,
        algorithmImage: image,
        baseImage,
        version: ver,
        cpu,
        gpu,
        mem,
        algorithmEnv,
        workerEnv,
        options,
        code: { path: codePath, entryPoint: codeEntryPoint },
        mounts
    };
};

const handleApply = async ({ endpoint, rejectUnauthorized, username, password, name, file, noWait, setCurrent, ...cli }) => {
    let result;
    let error;
    console.log('handleApply() before auth'); // logs for e2e
    const auth = new AuthManager({
        username,
        password,
        endpoint,
        rejectUnauthorized
    });
    await auth.init();
    console.log('handleApply() after auth'); // logs for e2e
    const spinner = ora({ text: 'Build starting', spinner: 'line' }).start();
    try {
        let stream;
        let fileData;
        let stats;
        if (file) {
            const fileContent = readFile(file);
            if (fileContent.error) {
                throw new Error(fileContent.error);
            }
            fileData = adaptFileData(fileContent.result);
        }

        const cliData = adaptCliData(cli);

        const algorithmData = merge(fileData, cliData, { name });
        const { code, ...algorithm } = algorithmData;
        spinner.text = `Requesting build for algorithm ${algorithmData.name}`;
        const body = {
            ...algorithm,
            entryPoint: code.entryPoint,
            userInfo: {
                platform: os.platform(),
                hostname: os.hostname(),
                username: os.userInfo().username
            }
        };

        if (code.path) {
            let codePath;
            const expandedPath = expandTilde(code.path);

            if (path.isAbsolute(expandedPath)) {
                codePath = path.resolve(expandedPath);
            }
            else {
                codePath = path.resolve(
                    file ? path.dirname(file) : process.cwd(),
                    expandedPath
                );
            }
            stats = await fse.stat(codePath);
            if (stats.isDirectory()) {
                // create zip file
                const zipFileName = await zipDirectory(codePath, { tmpFile: true, spinner });
                codePath = zipFileName;
                stats = await fse.stat(codePath);
            }
            stream = fse.createReadStream(codePath);
        }
        spinner.text = `Uploading algorithm data (size is ${stats && formatSize(stats.size)})`;
        const formData = new FormData();
        formData.append('payload', JSON.stringify(body));
        formData.append('file', stream || '');

        this._kc_token = await auth.getToken();
        result = await postFile({
            endpoint,
            rejectUnauthorized,
            formData,
            path: applyPath,
            headers: { Authorization: `Bearer ${this._kc_token}` }
        });
        spinner.succeed();
        if (result.result) {
            console.log(result.result.messages.join('\n'));
            if (!noWait) {
                await waitForBuild({ endpoint, rejectUnauthorized, auth, name: body.name, setCurrent, applyRes: { result } });
            }
        }
    }
    catch (e) {
        error = e.message;
        spinner.fail();
    }
    return {
        error: error || result.error, result
    };
};

module.exports = {
    handleApply,

};
