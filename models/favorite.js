const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var favoriteDishSchema = new Schema({
    _id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish' //Dishes can't be used as it is exported not schema
    }
});
var favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[favoriteDishSchema] 
    }
, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;