import express from 'express';

import auth from '../middlewares/auth';

import admin from '../middlewares/admin';

const router = express.Router();

import { registerController, loginController, userController, refreshController, productController } from '../controllers';

router.post('/register', registerController.register);

router.post('/login', loginController.login);

router.get('/me', auth, userController.me);

router.post('/refresh', refreshController.refresh);

router.post('/logout', auth, loginController.logout); //auth is required, because only valid token holder can logout

router.post('/products', [auth, admin], productController.store);

router.put('/products/:id', [auth, admin], productController.update); //id means, with every request id will be unique

router.delete('/products/:id', [auth, admin], productController.destroy); //destroy is method

router.get('/products', productController.index);

export default router;