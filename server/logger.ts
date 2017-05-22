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

// configuredTransports.push(new (transports.File)({ level: LEVEL,
//                                                   name: 'default-file',
//                                                   filename: 'logs/server.log',
//                                                   colorize: true,
//                                                   maxSize: 20000000,
//                                                   maxFiles: 4}));

// If development, add silly logging which will show all response data from SFDC
// if(process.env.NODE_ENV === 'development') {
//   configuredTransports.push(new (transports.File)({ level: 'silly',
//                                                     name: 'dev-file',
//                                                     filename: 'logs/dev-server.log',
//                                                     colorize: true,
//                                                     maxSize: 104857600,
//                                                     maxFiles: 1}));
// }

// if(process.env.NODE_ENV === 'production' && process.env.LOGGLY_TOKEN && process.env.LOGGLY_SUBDOMAIN) {
//   configuredTransports.push(new (transports.Loggly)({ level: process.env.LOG_LEVEL || LEVEL,
//                                                     token: process.env.LOGGLY_TOKEN,
//                                                     subdomain: process.env.LOGGLY_SUBDOMAIN,
//                                                     tags: ["Winston-NodeJS"],
//                                                     json:true}));
// }

export const logger = new (Logger)({ exitOnError: false, transports: configuredTransports });


logger.info('Log Level:', LEVEL);


 

