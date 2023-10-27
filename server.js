import express from 'express';

import connection from "./utils/connection";

import { APP_PORT } from './config';

import errorHandler from './middlewares/errorHandler';

const app = express();

import routes from './routes';

import path from 'path';

//import mongoose from 'mongoose';

//database connection
// mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('DB connected...');
// });


global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({ extended: false }))

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

//app.use(errorHandler);

//app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}.`));

app.listen(APP_PORT, async () => {
    console.log(`Listening on Port ${APP_PORT}`);
    await connection();
});