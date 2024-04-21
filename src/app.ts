import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import mongodb from './db/mongodb';
import authRoutes from './routes/authRoutes';


const app = express();
mongodb.connectDB();

app.use(express.json({ limit: '500mb' }))


app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/v1/auth", authRoutes)



app.listen(config.PORT, () => {
    console.log('\n\nServer running on PORT:', config.PORT);
});
