
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-Local-Mongoose");


const userSchema = new schema({

    email: {
        type: String,
        required: true,
    }

})
userSchema.plugin(passportLocalMongoose);//automatically generates password(hashed+salted) and username 

module.exports = mongoose.model("User", userSchema);