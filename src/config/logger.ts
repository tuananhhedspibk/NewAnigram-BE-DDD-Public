import { Configuration } from 'log4js';

export const loggerConfig: Configuration = {
  appenders: {
    default: { type: 'console', layout: { type: 'colored' } },
    sql: { type: 'console', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['default'], level: 'ALL', enableCallStack: true },
    sql: { appenders: ['sql'], level: 'ALL' },
  },
  disableClustering: true,
};
