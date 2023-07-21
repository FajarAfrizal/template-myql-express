// Import Modules
const dayjs = require('dayjs');
const fs = require('fs');
const util = require('util');
const path = require('path');

/**
 * Helper untuk logging
 * @param {String} level Tingkatan kepentingan log
 * @param {String} module Modul/Fungsi apa yang akan di-log
 * @param {String} message Pesan log
 * @param {String} stack Stack untuk error
 */

const logger = (level, module, message, stack = '') => {
  const ENV = process.env.NODE_ENV;
  const logDir = path.join(process.env.ROOT_DIR, 'logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = (name) => {
    return fs.createWriteStream(`${logDir}/${name}.log`, { flags: 'a' });
  };

  const dateFormat = dayjs().format('DD-MM-YYYY HH:mm');
  const format = `[${dateFormat}] - [${module}]: ${level} - ${message}`;
  const fileFormat = {
    date: dateFormat,
    module,
    level,
    message,
    stack,
  };

  switch (level) {
    case 'error':
      if (ENV === 'production') {
        logFile('error').write(`${util.format(fileFormat)}\n`);
      } else {
        logFile('error').write(`${util.format(fileFormat)}\n`);
        console.log(format);
        console.log(stack);
      }

      break;

    default:
      if (ENV === 'production') {
        logFile('info').write(`${util.format(fileFormat)}\n`);
      } else {
        console.log(format);
      }

      break;
  }
};

module.exports = logger;
