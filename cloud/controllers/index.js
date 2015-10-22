exports.index = function (req, res) {
  res.render('inicio/index', {});
}

exports.registro = function (req, res) {
  var query = new Parse.Query('Pais');
  var idiomas = [];
  query.find({
    success: function(paises) {
      for (var i = 0; i<paises.length; i++) {
        var idioma = paises[i].get("idioma");
        if (idiomas.indexOf(idioma) <= -1) {
           idiomas.push(idioma);
        }
      }
      res.render('registro/registro', {pais:idiomas});
    },
    error: function() {
      res.send(500, 'User not found');
    }
  });
}

exports.login = function (req, res) {
  res.render('login/login', {});
}
