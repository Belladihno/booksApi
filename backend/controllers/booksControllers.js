import Book from '../models/booksModels.js';
import APIFeatures from '../utils/apiFeatures.js';

class BooksControllers {
  async getTopBooks(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,author,price,ratingsAverage';
    next();
  }
  async getAllBooks(req, res) {
    try {
      const features = new APIFeatures(Book.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const books = await features.query;
      res.status(200).json({
        status: 'success',
        results: books.length,
        data: {
          books,
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Error fectching books', error: err.message });
    }
  }

  async getSingleBook(req, res) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'Book not found!!', err });
      }
      res.status(200).json({
        status: 'success',
        data: {
          book,
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Error fectching book', err });
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
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!book) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'Book not found!!', err });
      }
      res.status(200).json({
        status: 'success',
        data: {
          book,
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Error fectching book', err });
    }
  }

  async deleteBook(req, res) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'Book not found!!', err });
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Error fectching book', err });
    }
  }

  async getBookStats(req,res) {
    try {
      const stats = await Book.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            _id: '$genre',
            numBooks: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            averageRating: { $avg: '$ratingsAverage' },
            averagePrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: { avgPrice: 1 }
        }
      ]);
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Error fectching book', err });
    }
  }

  async getMonthlyPlan(req,res) {
    try {
      const year = req.params.year * 1;
      const plan = await Book.aggregate([
        {
          $unwind: '$startDates'
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates'},
            numBooksStarts: { $sum: 1 },
            books: { $push: '$name' }
          }
        },
        {
          $addFields: { month: '$_id' }
        },
        {
          $project: {
            _id: 0
          }
        },
        {
          $sort: { numBooksStarts: -1 }
        },
        {
          $limit: 12
        }
      ])
      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: 'fail', message: 'Error fectching book', error: err.message });
    }
  }
}

export default new BooksControllers();
