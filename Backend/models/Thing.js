const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  userId: { type: String},
  name: { type: String},
  manufacturer: {type: String},
  description: { type: String},
  mainPepper: { type: String},
  imageUrl: { type: String,},
  heat: { type: Number},
  likes: { type: Number},
  dislikes: { type: Number},
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]}
});

module.exports = mongoose.model('Sauces', thingSchema);

// name: { type: String, required: true },