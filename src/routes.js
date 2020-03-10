import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';
const routes = new Router();

routes.get('/', (req, res) => {
    return res.json({ OK: true });
});

routes.post('/sessions', SessionController.store);
routes.post('/recipients/find', RecipientController.index);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/update', RecipientController.update);

export default routes;
