const joi = require('joi');

const listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().min(1000).required(),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string().valid(
            'beach', 'lake', 'mountain', 'cabin', 'villa',
            'arctic', 'forest', 'desert', 'city', 'campfire',
            'snow', 'hotel'
        ).required()
    }).required()
});



const listingReviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required()
    }).required()
})

const listingUserSchema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

// Exporting the schemas
module.exports = {
    listingSchema,
    listingReviewSchema,
    listingUserSchema
};