import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import path from 'path';
// import Youch from 'youch';
// import * as Sentry from '@sentry/node';

// import 'express-async-errors';

// import sentryConfig from './config/sentry';
import redisConfig from './config/redis';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    // Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    // this.exceptionHandler();
  }

  middlewares() {
    // this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(helmet());
    this.server.use(express.json({ limit: '12Mb' }));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    if (process.env.NODE_ENV !== 'development') {
      this.server.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient(redisConfig),
          }),
          windowMs: 1000 * 60 * 15,
          max: 100,
        })
      );
    }
  }

  routes() {
    this.server.use(routes);

    // this.server.use(Sentry.Handlers.errorHandler());
  }

  // exceptionHandler() {
  //   this.server.use(async (err, req, res, next) => {
  //     if (process.env.NODE_ENV === 'development') {
  //       const errors = await new Youch(err, req).toJSON();

  //       return res.status(500).json(errors);
  //     }

  //     return res.status(500).json({ message: 'Internal server error' });
  //   });
  // }
}

export default new App().server;
