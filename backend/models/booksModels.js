import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['To read', 'Reading', 'Read'],
    default: 'To read',
  }
},{timestamps: true, versionKey: false});

const Book = mongoose.model('Book', bookSchema);

export default Book;
