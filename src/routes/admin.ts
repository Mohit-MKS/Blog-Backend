import express from 'express';

import adminController from '../controllers/admin'

const adminRouter = express.Router();



// /admin/add-product => GET
adminRouter.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
adminRouter.get('/products', adminController.getProducts);

// /admin/add-product => POST
adminRouter.post('/add-product', adminController.postAddProduct);

adminRouter.get('/edit-product/:productId', adminController.getEditProduct);

adminRouter.post('/edit-product', adminController.postEditProduct);

adminRouter.post('/delete-product', adminController.postDeleteProduct);


export { adminRouter };