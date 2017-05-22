import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { logger } from '../logger';

export function error(res: Response, err: any) {
  if(typeof(err) === 'string') {
    err = {message: err};
  }
  logger.warn('Returning error response', err);
  sendJson(res, {error: err['message'], err: err}, 400);
}

export function log(args) {
  logger.info(args);
}

export function sendJson(res: Response, content: any = {}, status: number = 200) {
  content = content || {};
  res.status(status);
  if(status < 200 || status > 299) {
    logger.warn('Error status returned', status, content);
  }
  logger.silly('returning JSON', content);
  return res.json({data: content});
}