import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log('Error connceting to database', err);
    process.exit(1);
  }
};

export default connectDB;
