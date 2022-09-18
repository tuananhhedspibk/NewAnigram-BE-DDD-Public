import * as log4js from 'log4js';
import { loggerConfig } from '@config/logger';

class Logger {
  public default: log4js.Logger;
  public system: log4js.Logger;
  public api: log4js.Logger;
  public access_req: log4js.Logger;
  public access_res: log4js.Logger;
  public sql: log4js.Logger;
  public auth: log4js.Logger;

  constructor() {
    log4js.configure(loggerConfig);

    this.system = log4js.getLogger('system');
    this.api = log4js.getLogger('api');
    this.access_req = log4js.getLogger('access_req');
    this.access_res = log4js.getLogger('access_res');
    this.sql = log4js.getLogger('sql');
    this.auth = log4js.getLogger('auth');
  }
}

export default new Logger();
