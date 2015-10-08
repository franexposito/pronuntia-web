var _ = require('underscore');

//Obtengo todos los Audios
Parse.Cloud.define("listAudios", function(request, response) {
  var query = new Parse.Query("Audios");
  query.find({
    success: function(audios) {
      response.success(audios);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

//Almacenamos un Audio creado por el actual usuario
Parse.Cloud.define("addAudio", function(request, response) {
  var audio = new Parse.Object.extend("Audio");

  var source = new Parse.File("audio.wav", request.params.source);
  audio.get("file", source);
  var Pais = Parse.Object.extend('Pais');
  audio.set("pais", new Pais({id: request.params.idioma}));
  audio.set("palabra", request.params.palabra);
  audio.set("user", Parse.User.current());

  audio.get("me_gusta", 0);
  audio.get("escuchado", 0);
  audio.get("favoritos", 0);

  audio.setACL(new Parse.ACL(Parse.User.current()));

  audio.save(null, {
    success: function(audio) {
      response.success(true);
    },
    else: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});
