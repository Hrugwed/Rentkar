const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema,listingReviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req,res,next) =>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in");
        return res.redirect("/user/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }
    if (!listings.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
        const { error } = listingSchema.validate(req.body);
        if (error) {
            let errMsg = error.details.map(el => el.message).join(',');
            throw new ExpressError(errMsg, 400);
        }
        next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = listingReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(errMsg, 400);
    }
    next();
}