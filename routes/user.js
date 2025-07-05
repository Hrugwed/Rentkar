const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware.js');
const userController = require('../controller/user.js');


router.route('/signup')
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router.route('/login')
.get(userController.renderLogin)
.post(
    savedRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/user/login', failureFlash: true }),
    wrapAsync(userController.login)
);

router.get("/logout", userController.logout);

module.exports = router;