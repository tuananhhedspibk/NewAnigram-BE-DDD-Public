module.exports = {
  process(_src, filename, _config, _options) {
    return 'module.export = ' + JSON.stringify(filename) + ';';
  },
};
