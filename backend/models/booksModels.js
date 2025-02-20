import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A book must have a title'],
      trim: true,
      unique: true,
      maxlength: [40, 'A book title must have less or equal than 40 characters'],
      minlength: [10, 'A book title must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Book title must only contain characters']
    },
    slug: String,
    author: {
      type: String,
      required: [true, 'A book must have an author'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'A book must have a genre'],
      trim: true,
      enum: {
        values: ['Reality', 'Emotional', 'Fantasy'],
        message: 'Genre is either: Reality, Emotional, Fantasy',
      }
    },
    status: {
      type: String,
      enum: ['To read', 'Reading', 'Read'],
      default: 'To read',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
      validate: 
      {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    secretBook: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
bookSchema.virtual('pricePercentage').get(function () {
  return this.price / 100;
})

// Document middleware: runs before .save() and .create()
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// bookSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// })

// bookSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query middleware
bookSchema.pre(/^find/, function (next) {
  this.find({ secretBook: { $ne: true } });

  this.start = Date.now();
  next();
});

bookSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs)
  next();
});

// Aggregation middleware
bookSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretBook: { $ne: true}}})
  console.log(this.pipeline());
  next();
})


const Book = mongoose.model('Book', bookSchema);

export default Book;