const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require('../controller/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js'); //import cloudinary configuration
const upload = multer({storage});
// Index
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
    

// New
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Create
router

// Show Put delete routes
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
// Edit
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;