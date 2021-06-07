const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: {type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number},
  likes: { type: Number},
  dislikes: { type: Number},
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]}
});

module.exports = mongoose.model('Sauces', thingSchema);

// name: { type: String, required: true },