const ignore = (args) => `.git
.hkubeignore
.stfolder
**/__pycache__
${args.definitionFile}
`;

module.exports = ignore;
