const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js")
const { validatereview, isloggedin, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");






//post reviews
router.post("/", isloggedin, validatereview, wrapAsync(reviewController.createReview));


//delete review 

router.delete("/:reviewId", isloggedin, isReviewAuthor, wrapAsync(reviewController.deleteReview));



module.exports = router;