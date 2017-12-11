import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as errorHandler from 'errorhandler';
import { logger } from './util/Logger';
import { RegistrableController } from './controller/RegisterableController';
import container from './inversify.config';
import TYPES from './types';

export class Server {
  private readonly SERVER_PORT: number = 8080;

  private app: express.Application = express();
  private httpServer: HttpServer = createServer(this.app);
  private httpPort: number | string | boolean = process.env.PORT || this.SERVER_PORT;

  private static instance: Server = null;

  private constructor() {
    // configure application
    this.config(this.app);

    // add routes
    this.routes(this.app);

    // listen on provided ports
    this.httpServer.listen(Server.normalizePort(this.httpPort));

    // add error handler
    this.httpServer.on('error', Server.onError);

    // start listening on port
    this.httpServer.on('listening', () => Server.onListening(this.httpPort));
  }

  public static bootstrap(): Server {
    if (Server.instance === null) {
      Server.instance = new Server();
    }

    return Server.instance;
  }

  private config(app: express.Application): void {
    // add static paths
    app.use(express.static(path.join(__dirname, 'public')));

    // mount json form parser
    app.use(bodyParser.json());

    // mount query string parser
    app.use(bodyParser.urlencoded({
      extended: true,
    }));

    // mount cookie parser middleware
    // this.app.use(cookieParser('SECRET_GOES_HERE'));

    app.use((err: Error, req: express.Request, res: express.Response) => {
      const serverErrorStatus: number = 500;
      res.status(serverErrorStatus).send('Internal Server Error');
    });

    // error handling
    app.use(errorHandler());
  }

  private routes(app: express.Application): void {
    container.getAll<RegistrableController>(TYPES.Controller)
      .forEach(controller => controller.register(app));
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  private static normalizePort(val: any): number | string | boolean {
    const intRadix: number = 10;
    const port = parseInt(val, intRadix);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server 'error' event.
   */
  private static onError(error: any): void {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error('Server requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error('Server is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server 'listening' event.
   */
  private static onListening(bind: number | string | boolean): void {
    logger.info('Listening on ' + bind);
  }

}

createConnection()
  .then(connection => Server.bootstrap())
  .catch(error => logger.error('Create connection: ' + error));
