import express from 'express';
import bookRoutes from './routes/bookRoutes.js';
import AppError from './utils/appError.js';
import errorHandler from './controllers/errorController.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', bookRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
