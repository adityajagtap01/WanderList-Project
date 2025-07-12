

const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new")
};


// module.exports.createListing = async (req, res, next) => {
//     let url = req.file.path;
//     let filename = req.file.filename;

//     let result = listingSchema.validate(req.body);

//     if (result.error) {
//         throw new ExpressError(400, result.error);
//     }

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename };
//     await newListing.save();
//     req.flash("success", "New Listing Created!");

//     res.redirect("/listings");



// }

module.exports.createListing = async (req, res) => {
    try {
        const listingData = req.body.listing;

        // Check if file exists
        if (!req.file) {
            req.flash("error", "Image is required!");
            return res.redirect("/listings/new");
        }

        listingData.image = {
            url: req.file.path,
            filename: req.file.filename
        };

        const newListing = new Listing(listingData);
        newListing.owner = req.user._id;
        await newListing.save();

        req.flash("success", "Listing Created!");
        res.redirect(`/listings/${newListing._id}`);
    } catch (e) {
        console.log("Error in creating listing:", e);
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("/listings/new");
    }
};



module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner")    //nesting populate
    if (!listing) {
        req.flash("error", "Listing you requested for does not exit!");
        res.redirect("/listings");
    }

    res.render("listings/show", { listing });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Updated!");

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/uploads", "/upload/w_250");

    res.render("listings/edit", { listing, originalImageUrl });


}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listingData = req.body.listing;


    //listingData.image = { url: listingData.image };

    let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });



    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`); // Redirect to show page to verify
}

module.exports.deletedListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}



module.exports.index = async (req, res) => {
    const { q } = req.query;

    let allListings;
    let noResults = false;

    if (q) {
        const regex = new RegExp(q, 'i'); // case-insensitive
        allListings = await Listing.find({
            $or: [
                { title: regex },
                { country: regex },
                { location: regex }
            ]
        });

        if (allListings.length === 0) {
            noResults = true;
        }
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, q, noResults });
};
