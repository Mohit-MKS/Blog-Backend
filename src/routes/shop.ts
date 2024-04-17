import express from 'express';
import path from 'path';
import { rootDir } from '../util/path';
import { products } from './admin';

const shopRouter = express.Router();


// shopRouter.get('', (req, res, next) => {
//     console.log(products)
//     res.sendFile(path.join(rootDir, 'views', 'shop.html'));
// });


shopRouter.get('/', (req, res, next) => {
    const productss = products;
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
 


export { shopRouter };