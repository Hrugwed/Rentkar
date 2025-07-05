const User = require("../models/user.js");

// Render signup form
module.exports.renderSignup = (req, res) => {
    res.render('./users/signup.ejs');
};

// Register new user
module.exports.signup = async (req, res, next) => {
    let { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        req.flash('error', 'Email already exists. Please use a different email.');
        return res.redirect('/user/signup');
    }
    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', `Welcome, ${registeredUser.username}!`);
            res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/user/signup');
    }
};

// Render login form
module.exports.renderLogin = (req, res) => {
    res.render('./users/login.ejs');
};

// Login user
module.exports.login = async (req, res) => {
    req.flash('success', `Welcome ${req.user.username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Logout user
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out');
        res.redirect('/listings');
    });
};