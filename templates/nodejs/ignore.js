const ignore = (args) => `.git
.hkubeignore
.stfolder
node_modules
${args.definitionFile}
`;

module.exports = ignore;
