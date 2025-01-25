import express from 'express';
import BooksControllers from '../controllers/booksControllers.js';

const router = express.Router();

router.get('/api/book', BooksControllers.getAllBooks);
router.get('/api/book/:id', BooksControllers.getSingleBook);
router.post('/api/book', BooksControllers.createBook);
router.patch('/api/book/:id', BooksControllers.updateBook);
router.delete('/api/book/:id', BooksControllers.deleteBook);

export default router;