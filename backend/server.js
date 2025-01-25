import express from 'express';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import connectDB from './database/db.js';



connectDB();
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', bookRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})