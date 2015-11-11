var express = require('express');
var moment = require('cloud/libs/moment');
var _ = require('underscore');
//var parseExpressHttpsRedirect = require('parse-express-https-redirect');
//var parseExpressCookieSession = require('parse-express-cookie-session');

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
var palabrasController = require('cloud/controllers/palabras.js');
var seguidoresController = require('cloud/controllers/seguidores.js');
var userController = require('cloud/controllers/user.js');

// Global app configuration section
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
//app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());
//app.use(express.cookieParser('fran'));
//app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));
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
app.get('/login', indexController.login);
app.get('/land', indexController.land);
app.get('/grabar', indexController.new);
app.get('/:username', userController.profile);
/*app.post('/login', function(req, res) {
  Parse.User.logIn(req.body.username, req.body.password).then(function() {
    res.send(true);
  }, function(error) {
    res.send(false);
  });
});*/
app.listen();
