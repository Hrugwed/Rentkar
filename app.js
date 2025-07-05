if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); //load environment variables from .env file
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoSession = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');



const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const MongoStore = require('connect-mongo');

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


const db_Url = process.env.MONGO_LINK;

const store = MongoStore.create(
    {
        mongoUrl: db_Url,
        crypto:{
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 60 * 60, 

    }
);

store.on('error', function (e) {
    console.log('Session store error', e);
});

//session configuration
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
};

app.use(session(sessionConfig)); 
app.use(flash()); 
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(db_Url)
};

app.get('/', (req, res) => {
    res.redirect('/listings');
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.update = req.flash('update');
    res.locals.deleteList = req.flash('deleteList');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    res.locals.mapToken = process.env.MAP_TOKEN;
    next();
});


app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
app.use('/user', userRouter);


//wrong path
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//error handling on server side
app.use((err, req, res, next) => {
    //express error handling middleware
    let { status = 500 } = err;
    let { message = 'Something went wrong' } = err;
    res.render("error.ejs", { message, status });
});

//this is the port number
const Port = 3000;

app.listen(Port, () => {
    console.log(`Server is running on port http://localhost:${Port}`);
});