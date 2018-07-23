var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }

});

User.plugin(passportLocalMongoose); // this will add password hash


module.exports = mongoose.model('User', User);