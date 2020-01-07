import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import redisConfig from './config/redis';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import InstrumentController from './app/controllers/InstrumentController';
import SkillController from './app/controllers/SkillController';
import MusicianController from './app/controllers/MusicianController';
import StyleController from './app/controllers/StyleController';
import UserStylePreferenceController from './app/controllers/UserStylePreferenceController';
import BandController from './app/controllers/BandController';
import BandStyleController from './app/controllers/BandStyleController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

import validateSessionStore from './app/validators/SessionStore';
import validateUserStore from './app/validators/UserStore';

const routes = new Router();

const bruteStore = new BruteRedis(redisConfig);
const bruteForce = new Brute(bruteStore);

routes.get('/', (req, res) => res.send('OK'));

/**
 * Public routes
 */

routes.post(
  '/v1/sessions',
  bruteForce.prevent,
  validateSessionStore,
  SessionController.store
);
routes.post('/v1/users', validateUserStore, UserController.store);

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

routes.get('/v1/styles', StyleController.index);

routes.get('/v1/preferences', UserStylePreferenceController.index);
routes.post('/v1/preferences', UserStylePreferenceController.store);
routes.delete('/v1/preferences/:id', UserStylePreferenceController.destroy);

routes.get('/v1/bands', BandController.index);
routes.post('/v1/bands', BandController.store);
routes.put('/v1/bands/:id', BandController.update);
routes.delete('/v1/bands/:id', BandController.destroy);

routes.post('/v1/bands/:bandId/styles', BandStyleController.store);
routes.delete('/v1/bands/:bandId/styles/:id', BandStyleController.delete);

/**
 * Admin routes
 */

routes.use(adminMiddleware);

routes.post('/v1/instruments', InstrumentController.store);

routes.post('/v1/styles', StyleController.store);

export default routes;
