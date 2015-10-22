var express = require('express');
var moment = require('cloud/libs/moment');
var _ = require('underscore');

//iniciamos express
var app = express();

//Controladores
var audioController = require('cloud/controllers/audio.js');
var commentsController = require('cloud/controllers/comments.js');
var favoritosController = require('cloud/controllers/favoritos.js');
var indexController = require('cloud/controllers/index.js');
var megustaController = require('cloud/controllers/megusta.js');
var monigotesController = require('cloud/controllers/monigotes.js');
var paisController = require('cloud/controllers/pais.js');
var seguidoresController = require('cloud/controllers/seguidores.js');
var userController = require('cloud/controllers/user.js');

// Global app configuration section
var nombreMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
                   "Octubre", "Noviembre", "Diciembre"];
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');  // Switch to Jade by replacing ejs with jade here.
app.use(express.bodyParser());
app.use(express.methodOverride());


app.locals._ = _;
moment.locale('es');
app.locals.formatTime = function(fecha) {
  return moment(fecha).format("MMMM [de] YYYY");
};
app.locals.formatTimeAudio = function(fecha) {
  return moment(fecha).format("DD/MM/YYYY");
};

app.get('/registro', indexController.registro);
app.get('/', indexController.login);
app.get('/:username', userController.profile);
app.listen();
