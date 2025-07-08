const Listing = require('../models/listing.js');
const geoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN; // Ensure you have set this in your environment variables
const geocodingClient = geoCoding({ accessToken: mapToken });
// Index
module.exports.index = async (req, res) => {
    const { q, category } = req.query;
    let listings = [];

    if (category) {
        listings = await Listing.find({ category });

        if (listings.length === 0) {
            req.flash('error', 'No listings found in this category');
            listings = await Listing.find({});
        }
    }

    else if (q && q.length > 0) {
        const regex = new RegExp('^' + q, 'i');
        listings = await Listing.find({
            $or: [
                { title: { $regex: regex } },
                { location: { $regex: regex } },
                { country: { $regex: regex } }
            ]
        });

        if (listings.length === 0) {
            req.flash('error', 'Listing not found');
            listings = await Listing.find({});
        }
    }

    else {
        listings = await Listing.find({});
    }

    res.render('./listings/index.ejs', { listings, q, category });
};

// New
module.exports.renderNewForm = (req, res) => {
    res.render('./listings/new.ejs');
};

// Create
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    if (req.body.listing.category) {
        newListing.category = req.body.listing.category;
    }

    if (req.file) {
        newListing.image = {
            filename: req.file.filename,
            url: req.file.path
        };
    }

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash('success', 'New listing created successfully!');
    res.redirect(`/listings/${newListing._id}`);
};


// Show
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "review",
            populate: { path: "author" }
        })
        .populate("owner");
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('./listings/show.ejs', { listing });
};

// Edit
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', { listing });
};

// Update
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }

    if (!req.body.listing.category) {
        req.body.listing.category = listing.category;
    }

    if (
        req.body.listing.location &&
        req.body.listing.location !== listing.location
    ) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        listing.geometry = response.body.features[0].geometry;
    }

    listing.set(req.body.listing);
    if (req.file) {
        listing.image = {
            filename: req.file.filename,
            url: req.file.path // or req.file.url if Cloudinary
        };
    }

    await listing.save();
    req.flash('update', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
};


// Delete

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
};
