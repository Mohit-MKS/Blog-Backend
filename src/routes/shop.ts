import express from 'express';

import shopController from '../controllers/shop';


const shopRouter = express.Router();


// shopRouter.get('', (req, res, next) => {
//     console.log(products)
//     res.sendFile(path.join(rootDir, 'views', 'shop.html'));
// });



shopRouter.get('/', shopController.getIndex);

shopRouter.get('/products', shopController.getProducts);

shopRouter.get('/products/:productId', shopController.getProduct);

shopRouter.get('/cart', shopController.getCart);

shopRouter.post('/cart', shopController.postCart);

shopRouter.post('/cart-delete-item', shopController.postCartDeleteProduct);

shopRouter.get('/orders', shopController.getOrders);

shopRouter.get('/checkout', shopController.getCheckout);



export { shopRouter };