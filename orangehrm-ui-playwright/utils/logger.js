const { createLogger, format, transports } = require('winston');


//create successfullly createdLogin started

// Employee created successfully

// Search completed

// Employee deleted console 

const log = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...meta }) =>
      `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'test-results/run.log' }),
  ],
});

log.step = (msg) => log.info(`STEP: ${msg}`);
module.exports = { log };