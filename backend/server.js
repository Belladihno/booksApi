import dotenv from 'dotenv';
import connectDB from './database/db.js';
import app from './app.js';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const port = process.env.PORT || 8000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
