import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import mongodb from './db/mongodb';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import fileRoutes from './routes/fileRoutes';
import postRoutes from './routes/postRoutes';

import { errorHandler } from './middlewares/errorMiddleware';
import { notFound } from './controllers/notfoundController';


const app = express();
mongodb.connectDB();

app.use(express.json({ limit: '500mb' }))


app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }));

app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  // const allowedOrigin = process.env.ALLOWED_DOMAINS;
  // if (allowedOrigin && allowedOrigin.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  // }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,Tokenuserid,Appid,refreshtoken,app_key,app_secret"
  );
  res.header("Access-Control-Expose-Headers", "tokens");
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
});
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/file", fileRoutes);
app.use("/api/v1/post", postRoutes);


app.use('*', notFound)

app.use(errorHandler)



app.listen(config.PORT, () => {
  console.log('\n\nServer running on PORT:', config.PORT);
});
