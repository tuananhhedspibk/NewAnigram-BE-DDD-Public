import * as dayjs from 'dayjs';

import { Response, Request } from 'express';

import * as util from 'util';

import logger from '@utils/logger';
import { HttpException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const maskData = require('maskdata');

type ResponseLog = {
  requestId: number;
  statusCode: number;
  data?: FixType;
  message?: string;
};

const _maskFields = (object: FixType, fields: string[]): FixType => {
  const maskOptions = {
    maskWith: '*',
    fields,
  };

  return maskData.maskJSONFields(object, maskOptions);
};

export const requestLogger = (request: Request) => {
  const { ip, originalUrl, method, params, query, body, headers } = request;

  // now ip method url object
  const logTemplate = '%s %s %s %s %s';
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

  const logContent = util.formatWithOptions(
    { colors: true },
    logTemplate,
    now,
    ip,
    method,
    originalUrl,
    JSON.stringify({
      method,
      url: originalUrl,
      userAgent: headers['user-agent'],
      body: _maskFields(body, ['password']),
      params,
      query,
    }),
  );

  logger.access_req.info(logContent);
};

export const responseLogger = (input: {
  requestId: number;
  response: Response;
  data: FixType;
}) => {
  const { requestId, response, data } = input;

  const log: ResponseLog = {
    requestId,
    statusCode: response.statusCode,
    data: data.data,
  };

  logger.access_res.info(JSON.stringify(log));
};

export const responseErrorLogger = (input: {
  requestId: number;
  exception: HttpException | Error;
}) => {
  const { requestId, exception } = input;

  const log: ResponseLog = {
    requestId,
    statusCode:
      exception instanceof HttpException ? exception.getStatus() : null,
    message: exception?.stack || exception?.message,
  };

  logger.access_res.info(JSON.stringify(log));
  logger.access_res.error(exception);
};
