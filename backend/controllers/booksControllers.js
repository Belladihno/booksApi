import Book from '../models/booksModels.js';

class BooksControllers {
  async getAllBooks(req, res) {
    try {
      const books = await Book.find();
      res.status(200).json({
        status: 'success',
        data: {
          books,
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Error fectching books', err});
    }
  }

  async getSingleBook(req, res) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ status: 'fail', message: 'Book not found!!', err });
      }
      res.status(200).json({
        status: 'success',
        data: {
          book,
        },
      });
    } catch (err) {
      res.status(500).json({ status: 'fail', message: 'Error fectching book', err });
    }
  }

  async createBook(req, res) {
    try {
      const book = await Book.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          book,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Error creating book', err });
    }
  }

  async updateBook(req, res) {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!book) {
        return res.status(404).json({ status: 'fail', message: 'Book not found!!', err });
      }
      res.status(200).json({
        status: 'success',
        data: {
          book,
        },
      });
    } catch (err) {
      res.status(500).json({ status: 'fail', message: 'Error fectching book', err });
    }
  }

  async deleteBook(req, res) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ status: 'fail', message: 'Book not found!!', err });
      }
      res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res.status(500).json({ status: 'fail', message: 'Error fectching book', err });
    }
  }
}

export default new BooksControllers();
