const fs = require('fs');
const path = require('path');
const config = require('../config/config');

module.exports = {
  /**
   * Clear workdir from processing artifacts
   */
  clearWorkdir() {
    const workdir = path.join(__dirname, config.WORKDIR);

    if (fs.existsSync(workdir)) {
      fs.rmdirSync(workdir, {
        recursive: true,
      });
    }

    fs.mkdirSync(workdir);
  },

  /**
   * Write script data to script file
   *
   * @param {string} scriptData
   */
  writeScript(scriptData = '') {
    const output = scriptData.replace(/(\r)/gm, '');

    const file = path.join(__dirname, config.WORKDIR, config.SCRIPT_FILE);

    fs.writeFileSync(file, output, {
      encoding: 'utf8',
    });
  },
};
