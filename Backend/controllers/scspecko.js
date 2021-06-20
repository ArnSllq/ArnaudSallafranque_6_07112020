const Sauces = require('../models/ScsPecko');
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
// Gestion des likes / dislikes
exports.likeSauce = async (req, res, next) => {
  const sauce = await Sauces.findById(req.params.id)
  const arrayUsersLikes = sauce.usersLiked
  const arrayUsersDislikes = sauce.usersDisliked
  let nbLike = 0
  let nbDislike = 0
  if(sauce.likes === undefined){
    sauce.likes = 0
  }
  if(sauce.dislikes === undefined){
    sauce.dislikes = 0
  }
// Partie qui gère à proprement parler, l'ajout/la suppression des likes et des dislikes sur une sauce
  switch (req.body.like) {
    // cas d'un dislike
    case -1:
      nbLike = parseInt(sauce.likes)
      nbDislike = parseInt(sauce.dislikes) + 1
      arrayUsersDislikes.push(req.body.userId)
      if(arrayUsersLikes.indexOf(req.body.userId) != -1){
        arrayUsersLikes.splice(arrayUsersLikes.indexOf(req.body.userId), 1)
      }
      break;
      // cas neutre, l'utilisateur n'a ni like, ni dislike la sauce
    case 0:
      if(arrayUsersLikes.indexOf(req.body.userId) != -1){
        arrayUsersLikes.splice(arrayUsersLikes.indexOf(req.body.userId), 1)
        nbLike = parseInt(sauce.likes) - 1
        nbDislike = parseInt(sauce.dislikes)
      }
      if(arrayUsersDislikes.indexOf(req.body.userId) != -1){
        arrayUsersDislikes.splice(arrayUsersDislikes.indexOf(req.body.userId), 1)
        nbDislike = parseInt(sauce.dislikes) - 1
        nbLike = parseInt(sauce.likes)
      }
      break;
      // cas d'un like
    case 1:
      nbLike = parseInt(sauce.likes) + parseInt(req.body.like)
      nbDislike = parseInt(sauce.dislikes)
      arrayUsersLikes.push(req.body.userId)
      if(arrayUsersDislikes.indexOf(req.body.userId) != -1){
        arrayUsersDislikes.splice(arrayUsersDislikes.indexOf(req.body.userId), 1)
      }
      break;
      
    default:
      break;
  }
Sauces.updateOne({ _id: req.params.id}, { likes: nbLike, usersLiked: arrayUsersLikes, dislikes: nbDislike, usersDisliked: arrayUsersDislikes})
.then(() => res.status(200).json({ message: 'Objet modifié !'}))
.catch(error => res.status(400).json({ error }));
};
// Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id
  }).then((sauces) => {res.status(200).json(sauces);
  }).catch((error) => {res.status(404).json({ error });
  });
};
// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};
// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
// Affichage de toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauces.find().then(
    (sauces) => {res.status(200).json(sauces);
    }).catch((error) => {res.status(400).json({error});
    }
  );
};