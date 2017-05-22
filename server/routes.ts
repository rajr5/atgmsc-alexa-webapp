import { Router, Response, Request } from 'express';
import { logger } from './logger';


import * as atgismController from './controllers/atgism';


const applicationRoutes: Router = Router();



/////////////// MIDDLEWARE ///////////////////////////////////

applicationRoutes.use(function (req, res, next) {
  logger.info(req.method,req.originalUrl);
  next();
});

/////////////// ROUTES ///////////////////////////////////

applicationRoutes.get('/atgism', atgismController.getAll);
applicationRoutes.post('/atgism', atgismController.create);
applicationRoutes.put('/atgism', atgismController.update);
applicationRoutes.get('/atgism/random', atgismController.getRandom);

export { applicationRoutes };
