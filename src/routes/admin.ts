import express from 'express';
import path from 'path';
import { rootDir } from '../util/path';

const adminRouter = express.Router();

const products: any[] = [];


adminRouter.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});


adminRouter.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/')
});


export { adminRouter, products };