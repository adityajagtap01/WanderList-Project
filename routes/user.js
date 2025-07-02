const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");



router.route("/signup")
    .get(userController.signupUser)
    .post(wrapAsync(userController.PostSignUp));




router.route("/login")
    .get(userController.login)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.postLogin
    );

router.get("/logout", userController.logout);









module.exports = router;