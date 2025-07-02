const { required } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    image: {
        url: String,
        filename: String,

    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    await Review.deleteMany({ _id: { $in: listing.reviews } })

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;