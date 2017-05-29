import { Router, Response, Request } from 'express';
import { logger } from './logger';
import * as passport from 'passport';
import { refreshToken } from './services/msft';
import { tokenResponse } from './services/msft-authorize';

import * as graphController from './controllers/msft-graph';
import * as atgismController from './controllers/atgism';
import * as authController from './controllers/auth';

const applicationRoutes: Router = Router();
const loginRoutes: Router = Router();

import * as _ from 'underscore';

/////////////// MIDDLEWARE ///////////////////////////////////

applicationRoutes.use(function (req, res, next) {
  logger.info(req.method,req.originalUrl);
  next();
});

async function addAuth(req: Request, res: Response, next: (err?) => void) {
  // get auth from params
  if(!req.query.access_token) {
    res['message'] = 'Invalid Authorization Token';
    return next({status: 400, message: 'access_token must be included with request'});
  }
  if(!req.query.refresh_token) {
    res['message'] = 'Invalid Authorization Token';
    return next({status: 400, message: 'refresh_token must be included with request'});
  }
  if(!req.query.expires) {
    res['message'] = 'Invalid Authorization Token';
    return next({status: 400, message: 'expires must be included with request'});
  }

  let access_token = req.query.access_token;
  let refresh_token = req.query.refresh_token;
  let expires = new Date(req.query.expires);
  if(new Date() >= expires) {
    console.log('Getting refresh token');
    try {
      // get refresh token
      const tokenResponse: tokenResponse = await refreshToken(refresh_token);
      req.user = tokenResponse;
      req.user.obtainedRefreshToken = true;
      return next();
    } catch (ex) {
      return next({message: 'Error getting refresh token', err: ex.error});
    }
  } else {
    console.log('Token valid, no refresh needed');
    req.user = {
      access_token,
      refresh_token,
      expires: new Date(expires),
      obtainedRefreshToken: false
    };
    next();
  }

}

///////// LOGIN ROUTES
/**
 * TODO - if session is expired, then get a new refresh token?
 * Or should front-wnd be in charge of this?
 */

/** Redirect to login page */
loginRoutes.get('/login', authController.redirectToLogin);
/** Redirect to logout page, this will re-direct the user back to the main app */
loginRoutes.get('/logout', authController.redirectToLogout);
/** Callback called from OAuth login page */
loginRoutes.get('/token', authController.tokenCallback);
/** Refresh token */
loginRoutes.put('/token', authController.getRefreshToken);

/////////////// APPLICATION API ROUTES ///////////////////////////////////

applicationRoutes.get('/atgism', atgismController.getAll);
applicationRoutes.post('/atgism', atgismController.create);
applicationRoutes.put('/atgism/promote', atgismController.promote);
applicationRoutes.get('/atgism/random', atgismController.getRandom);

applicationRoutes.get('/user/photo', addAuth, graphController.userProfilePhoto);

export { applicationRoutes, loginRoutes };
