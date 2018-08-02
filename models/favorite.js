const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var favoriteDishSchema = new Schema({
    dish:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dishes'
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