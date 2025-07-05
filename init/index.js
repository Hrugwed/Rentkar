const mongoose = require('mongoose');
const data = require('./data.js');  
const Listing = require('../models/listing.js');

//initializing backend and creating database
main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
};

// adding data

const initDb = async () => {
    await Listing.deleteMany({});
    data.sampleListings = data.sampleListings.map((obj) => ({ ...obj, owner: "685ce1ee1472c1867916aa0a" }));
    await Listing.insertMany(data.sampleListings);
    console.log('Database initialized with sample data:');
}

initDb()
    .then(() => {
        console.log('Database initialized successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error initializing database:', err);
        mongoose.connection.close();
    });