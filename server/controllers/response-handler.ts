import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { getExpires } from '../services/msft-authorize';

import { logger } from '../logger';

export function error(res: Response, err: any) {
  if(typeof(err) === 'string') {
    err = {message: err};
  }
  logger.warn('Returning error response', err);
  sendJson(res, {error: err['message'], err: err}, 400);
}

export function log(args) {
  console.info(args);
}

export function sendJson(res: Response, content: any = {}, status: number = 200, userInfo?: any) {
  content = content || {};
  res.status(status);
  if(status < 200 || status > 299) {
    logger.warn('Error status returned', status, content);
  }
  if(userInfo && userInfo.obtainedRefreshToken) {
    content.auth = {
      access_token: userInfo.access_token,
      refresh_token: userInfo.refresh_token,
      expires: getExpires(userInfo).toJSON(),
    };
    console.info('new auth info added to response');
  }
  return res.json({data: content});
}