import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/v1/users', UserController.store);
routes.post('/v1/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/v1/users', UserController.update);

export default routes;
