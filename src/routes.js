import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/', (req, res) => {
    return res.json({ OK: true });
});

routes.post('/sessions', SessionController.store);
routes.post('/recipients/find', RecipientController.index);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/update', RecipientController.update);

//Rotas de Gestão dos entregadores
routes.post('/upload', upload.single('file'), FileController.store);
routes.post('/register', DeliverymanController.store);
routes.delete('/delete/:id', DeliverymanController.delete);
routes.put('/update/:id', DeliverymanController.update);
routes.get('/listar', DeliverymanController.index);

//Rotas de gestão das encomendas
routes.post('/order/register', OrderController.store);

export default routes;
