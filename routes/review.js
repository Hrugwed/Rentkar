const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');
const reviewController = require('../controller/review.js');

// Create Review
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review
router.delete('/:reviewId', isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;