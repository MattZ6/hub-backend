import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import InstrumentController from './app/controllers/InstrumentController';
import SkillController from './app/controllers/SkillController';
import MusicianController from './app/controllers/MusicianController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();

/**
 * Public routes
 */
routes.post('/v1/users', UserController.store);
routes.post('/v1/sessions', SessionController.store);

/**
 * Private routes
 */
routes.use(authMiddleware);

routes.get('/v1/users', UserController.show);
routes.put('/v1/users', UserController.update);

routes.get('/v1/instruments', InstrumentController.index);

routes.get('/v1/skills', SkillController.index);
routes.post('/v1/skills', SkillController.store);
routes.delete('/v1/skills/:id', SkillController.destroy);

routes.get('/v1/musicians', MusicianController.index);

/**
 * Admin routes
 */
routes.use(adminMiddleware);

routes.post('/v1/instruments', InstrumentController.store);

export default routes;
