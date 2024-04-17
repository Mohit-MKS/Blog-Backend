
import bodyParser from "body-parser";
import express from "express";
import path from 'path';

import { adminRouter } from "./routes/admin";
import { shopRouter } from "./routes/shop";

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src/public'));


app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
    res.render('shop', {
        pageTitle: 'ERROR',
        path: '/',
        activeShop: true,
        productCSS: true
    });;
})


app.listen(3000);

