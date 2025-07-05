const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const { required } = require('joi');

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1745512737710-037977d7adb6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) => v === "" ? "https://images.unsplash.com/photo-1745512737710-037977d7adb6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    }
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  owner:
  {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
    type: String,
    enum: [
      'beach', 'lake', 'mountain', 'cabin', 'villa',
      'arctic', 'forest', 'desert', 'city', 'campfire',
      'snow', 'hotel'
    ],
    required: true
  }
});
//this is post middleware that runs after a listing 
ListingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
    console.log(` Listing middleware Worked `);
  }
});

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;

