const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Favorite collection
const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
