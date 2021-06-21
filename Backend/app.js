// Ajout des modules requis au fonctionnement de l'app
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

const saucesRoutes = require('./routes/scspecko');
const userRoutes = require('./routes/user');

dotenv.config()
// utilisation de dotenv ne pas afficher en clair les informations d'accés à la base de données
// vous devrez ajouter un nom d'utilisateur mongoDB et le mot de passe associé dans le fichier .ent après les ":" pour MONGODB_USER et MONGODB_PW
// vous devrez également remplacer la partie après le "@" par l'adresse menant à votre propre base de données mongoDB
mongoose.connect('mongodb+srv://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PW+'@cluster0.ubnpd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());
//route d'accès pour le stockage des images en local
app.use('/images', express.static(path.join(__dirname, 'images')));
//route d'accès pour les sauces et les utilisateurs
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;