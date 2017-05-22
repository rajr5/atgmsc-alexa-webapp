import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { error, log, sendJson } from './response-handler';
import { logger } from '../logger';
import { addATGIsm, getAllATGIsm, getRandomATGIsm, updateATGIsm, ATGIsm, ATGIsmInput, ATGIsmLimitedResponse } from '../services/db';
import * as _ from 'underscore';

//////////////// HELPER FUNCTIONS ////////////////////////


/////////////// ROUTES ///////////////////////////////////

export async function getAll(req: Request, res: Response) {
  try {
    const atgIsms: ATGIsm[] = await getAllATGIsm();
    sendJson(res, atgIsms);
  } catch (ex) {
    error(res, ex);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const input: ATGIsmInput = {person: req.body.person, message: req.body.message}
    await addATGIsm(input);
    sendJson(res, {}, 201);
  } catch (ex) {
    error(res, ex);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const input: ATGIsmInput = {person: req.body.person, message: req.body.message, approved: req.body.approved}
    await addATGIsm(input);
    sendJson(res, {}, 201);
  } catch (ex) {
    error(res, ex);
  }
}

export async function getRandom(req: Request, res: Response) {
  try {
    const input: ATGIsmInput = {person: req.body.person, message: req.body.message}
    const atgIsms: ATGIsmLimitedResponse = await getRandomATGIsm();
    sendJson(res, atgIsms, 200);
  } catch (ex) {
    error(res, ex);
  }
}