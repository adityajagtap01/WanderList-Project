if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

require("dotenv").config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");


const Review = require("./models/review.js")
const path = require("path");


const ejsMate = require("ejs-mate");
const session = require("express-session")
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, 'public')));



let dbUrl = process.env.ATLAS_URL;

async function main() {
    await mongoose.connect(dbUrl)
}
main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //time of one week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }

}



app.use(session(sessionOptions));
app.use(flash());

//implement passport->to be implemented after sesion

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({
//         email: "student@12gmail.com",
//         username: "smart-boy",
//     });

//     let registeredUser = await User.register(fakeuser, "india123");
//     res.send(registeredUser);
// })


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")








// app.get("/", (req, res) => {
//     res.send("Hi i am Aditya(root)..!");
// });


app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.status(statusCode).send(message);
    // res.send("something went wrong..!");
});
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));

// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});
app.listen(8080, () => {
    console.log("server is listening to port 8080 ");



});

