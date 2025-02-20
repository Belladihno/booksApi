import Book from '../models/booksModels.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

class BooksControllers {
  getTopBooks = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,author,price,ratingsAverage';
    next();
  };

  getAllBooks = catchAsync(async (req, res, next) => {
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
  });

  getSingleBook = catchAsync(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  });

  createBook = catchAsync(async (req, res, next) => {
    const book = await Book.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        book,
      },
    });
  });

  updateBook = catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  });

  deleteBook = catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  getBookStats = catchAsync(async (req, res, next) => {
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
        $sort: { averagePrice: 1 }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  });

  getMonthlyPlan = catchAsync(async (req, res, next) => {
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
          _id: { $month: '$startDates' },
          numBookStarts: { $sum: 1 },
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
        $sort: { numBookStarts: -1 }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  });
}

export default new BooksControllers();
