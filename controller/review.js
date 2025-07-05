const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

// Create Review
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.review.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Review created successfully!');
    res.redirect(`/listings/${listing._id}`);
};

// Delete Review
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review || !review.author) {
        req.flash('error', 'Review or author not found.');
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to delete this review.');
        return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('deleteList', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
};