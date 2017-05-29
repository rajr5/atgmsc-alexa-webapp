/**
 * Sets up winston logging
 * 
 */

import { Winston, Logger, add as WinstonAdd, transports } from 'winston';

const LEVEL = process.env.NODE_ENV === 'development' ? 'debug' : 'info';


const configuredTransports = [];
configuredTransports.push(new (transports.Console)({ level: LEVEL,
                                                     colorize: true,
                                                     prettyPrint: true}));

export const logger = new (Logger)({ exitOnError: false, transports: configuredTransports });


logger.info('Log Level:', LEVEL);


 

