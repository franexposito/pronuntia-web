exports.index = function (req, res) {
  res.render('inicio/index', {});
}

exports.registro = function (req, res) {
  var query = new Parse.Query('Pais');
  var idiomas = [];
  query.find().then( function(paises) {
    for (var i = 0; i<paises.length; i++) {
      var idioma = paises[i].get("idioma");
      if (idiomas.indexOf(idioma) <= -1) {
         idiomas.push(idioma);
      }
    }
    var queryMon = new Parse.Query('Monigotes');
    return queryMon.find();
  }).then( function (monigote) {
    res.render('registro/registro', {pais:idiomas, monigotes: monigote});
  }, function() {
    res.send(500, 'Error 500');
  });
}

exports.login = function (req, res) {
  res.render('login/login', {});
}

exports.land = function (req, res) {
  res.render('inicio/index');
}
