import * as express from 'express';
import * as path from 'path';
import { json, urlencoded } from 'body-parser';
import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { logger } from './logger';
import { setEnv } from './config';
import * as uuid from 'uuid';
import * as passport from 'passport';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';


import { applicationRoutes, loginRoutes } from './routes';

const app: express.Application = express();

app.use(json({limit: '20mb'}));
app.use(urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.disable('x-powered-by');

app.use('/auth', loginRoutes);
app.use('/api', applicationRoutes);

logger.info('ENV', app.get('env'));

app.use(passport.initialize());
// app.use(passport.session());

if(app.get('env') === 'production') {
  setEnv('production');
  app.use(express.static(path.join(__dirname, '..'))); // TODO - serve this
  // Catch all routes and deliver index page
  app.use((req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'index.html')); // TODO - serve this in prod
  });
}

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.error('Routing Error', req.originalUrl);
  var err = new Error('Not Found');
  err['status'] = 404;
  res['message'] = 'Endpoint was not found';
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let status = err.status || 500;
  if (status < 100 || status > 500) status = 500;
  res.status(status);
  let errorMessage = res['message'] || 'There was a server error processing your request'
  logger.error('Routing Error', {status: status, message: errorMessage, err: err, url: req.originalUrl});
  res.json({
      error: errorMessage,
      message: err.message
  });
});

export { app }
