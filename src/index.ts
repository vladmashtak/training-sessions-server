import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Server } from './Server';
import { logger } from './util/Logger';

createConnection()
  .then(connection => Server.bootstrap())
  .catch(error => logger.error('Create connection: ' + error));
