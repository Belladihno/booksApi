import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {});
    console.log(conn.connection.host);
    console.log('Database connected successfully');
  } catch (err) {
    console.log('Error connceting to database', err);
  }
};

export default connectDB;
