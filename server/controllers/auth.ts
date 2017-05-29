import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { error, log, sendJson } from './response-handler';
import { logger } from '../logger';
import { getProfilePhoto, getUserData, refreshToken } from '../services/msft';
import { getAuthURL, getLogoutURL, getTokenURL, tokenResponse, objToParams, getTokenAccessConfig, getLogoutConfig, getRefreshTokenAccessConfig, getExpires } from '../services/msft-authorize';
import { post, debug } from 'request-promise-native';

import * as _ from 'underscore';



/**
 * Redirect to MSFT login page
 * 
 * @export
 * @param {Request} req 
 * @param {Response} res 
 */
export function redirectToLogin(req: Request, res: Response) {
  const url = getAuthURL(req.query.finalURL);
  console.log('redirect url:', url);
  res.redirect(url);
}

export function redirectToLogout(req: Request, res: Response) {
  const url = getLogoutURL(req.query.redirectUrl);
  console.log('redirect url:', url);
  res.redirect(url);
}

/**
 * Callback from OAuth Login flow
 * 
 * @export
 * @param {Request} req 
 * @param {Response} res 
 */
export async function tokenCallback(req: Request, res: Response) {
  try {
    // now call to url and get token
    const state = req.query.state;
    const body = getTokenAccessConfig(req.query.code);
    const url: string = getTokenURL();

    const tokenResponse: tokenResponse = await post({url, json: true, form: body});
    console.log('success getting token', tokenResponse);
    
    /** Attempt to get user data and add data as parameters, if failed then just return auth info */
    try {
      const userData: any = await getUserData(tokenResponse.access_token);
      const expires: Date = getExpires(tokenResponse);
      const finalRedirectUrl = state + objToParams(_.extend({displayName: userData.displayName, mail: userData.mail, fullName: userData.givenName + ' ' + userData.surname, initials: userData.givenName[0] + userData.surname[0]}, tokenResponse, {expires: expires.toJSON()}));
      res.redirect(finalRedirectUrl);
    } catch(ex) {
      const finalRedirectUrl = state + objToParams(_.extend({userInfoError: 'could not get user info'}, tokenResponse));
      res.redirect(finalRedirectUrl);
    }
  } catch (ex) {
    console.log('error getting token', ex);
    res.redirect(encodeURI('/?error=There was an error authorizing this request'));
  }
}

/**
 * Get refresh token
 * 
 * @export
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getRefreshToken(req: Request, res: Response) {
  try {
    // now call to url and get token
    const body = getRefreshTokenAccessConfig(req.query.refreshToken);
    const url: string = getTokenURL();

    const tokenResponse: tokenResponse = await refreshToken(req.query.refreshToken);
    console.log('success getting token', tokenResponse);
    
    /** Attempt to get user data and add data as parameters, if failed then just return auth info */
    try {
      const expires: Date = getExpires(tokenResponse);
      const userData: any = await getUserData(tokenResponse.access_token);
      const output = objToParams(_.extend({displayName: userData.displayName, mail: userData.mail, fullName: userData.givenName + ' ' + userData.surname, initials: userData.givenName[0] + userData.surname[0]}, tokenResponse, {expires: expires.toJSON()}));
      sendJson(res, output);
    } catch(ex) {
      const output = objToParams(_.extend({userInfoError: 'could not get user info'}, tokenResponse));
      sendJson(res, output);
    }
  } catch (ex) {
    console.log('error getting token', ex);
    error(res, {message: 'There was an error authorizing this request'});
  }
}
