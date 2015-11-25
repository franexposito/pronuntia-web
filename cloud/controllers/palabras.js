//Obtengo el numero de palabras del idioma de Parse.User.current
Parse.Cloud.define('getNumbersWords', function (request, response) {
  var pais = request.user.get('pais');
  var query = new Parse.Query('Palabras');
  
  pais.fetch().then( function(country){ 
    query.equalTo('idioma', country.get('idioma').toLowerCase());
    return query.count();
  }).then( function(count) {
    response.success(count);
  }, function(error) {
    response.error({'resp': error.code, 'message': error.message});
  });
});