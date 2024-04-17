import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import { get404 } from './controllers/error';
// import db from './util/database';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views'); 

import { adminRouter } from './routes/admin';
import { shopRouter } from './routes/shop';

// db.execute('SELECT * FROM products')
//     .then(result => {
//         console.log(result[0], result[1]);
//     })
//     .catch(err => {
//         console.log(err);
//     });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(get404);

app.listen(3000);
