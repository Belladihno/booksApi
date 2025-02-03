import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/booksModels.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {});
    console.log(conn.connection.host);
    console.log('Database connected successfully');
  } catch (err) {
    console.log('Error connceting to database', err);
  }
};

// Import data into database
const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'books.json'), 'utf-8'));
const importData = async () => {
  try {
    await Book.create(books);
    console.log('Data imported successfully');
  } catch (err) {
    console.log('Error importing data', err);
  }
};

// Delete All data from database
const deleteData =  async () => {
    try {
        await Book.deleteMany();
        console.log('Data deleted successfully');
        process.exit();
    } catch (err) {
        console.log('Error deleting data', err);
    }
}

if(process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}


console.log(process.argv);

export default connectDB;