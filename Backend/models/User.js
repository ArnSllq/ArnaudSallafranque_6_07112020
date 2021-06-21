//Schéma de données pour le compte utilisateur
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
//plugin mongoose pour vérifier que les adresses mail sont bien uniques
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);