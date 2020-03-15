import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliverymanCounterController from './app/controllers/DeliverymanCounterController';
import CouriersController from './app/controllers/CouriersController';
import SignatureController from './app/controllers/SignatureController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/recipients/find', RecipientController.index);
//Rotas de problemas
routes.post('/delivery/:id/problem', DeliveryProblemController.store);
routes.get('/delivery/:id/problem', DeliveryProblemController.index);

//ROTAS DE ENTREGADORES
routes.get('/deliveryman/:id/deliveries', CouriersController.index);
routes.put(
    '/deliveryman/getdeliveries/:order_id',
    DeliverymanCounterController.update,
    CouriersController.update
);

routes.post(
    '/delivery/:order_id',
    upload.single('file'),
    SignatureController.store
);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/update', RecipientController.update);

//Rotas de Gestão dos entregadores
routes.put('/upload/:id', upload.single('file'), FileController.store);
routes.post('/register', DeliverymanController.store);
routes.delete('/delete/:id', DeliverymanController.delete);
routes.put('/update/:id', DeliverymanController.update);
routes.get('/listar', DeliverymanController.index);

//Rotas de gestão das encomendas
routes.post('/order', OrderController.store);
routes.get('/order', OrderController.index);
routes.delete('/order/:id', OrderController.delete);
routes.put('/order/:order_id', OrderController.update);

//Rota de remoção forçada

routes.delete(
    '/delivery/:id/cancel-delivery',
    DeliveryProblemController.update
);

export default routes;
