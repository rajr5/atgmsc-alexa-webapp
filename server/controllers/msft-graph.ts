import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { error, log, sendJson } from './response-handler';
import { logger } from '../logger';
import { getProfilePhoto, getUserData } from '../services/msft';
import * as _ from 'underscore';

//////////////// HELPER FUNCTIONS ////////////////////////


/////////////// ROUTES ///////////////////////////////////

export async function userData(req: Request, res: Response) {
  try {
    const userData: any = await getUserData(req.user.access_token);
    sendJson(res, userData, 200, req.user);
  } catch (ex) {
    error(res, ex);
  }
}

export async function userProfilePhoto(req: Request, res: Response) {
  try {
    const userData = await getProfilePhoto(req.user.access_token);
    const buffer = new Buffer(userData, 'binary').toString('base64');
    sendJson(res, {image: buffer}, 200, req.user);
  } catch (ex) {
    error(res, ex);
  }
}