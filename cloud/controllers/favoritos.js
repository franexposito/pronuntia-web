//Obtenemos todos los audios de un objectId
Parse.Cloud.define("getFavoriteAudiosFromUserId", function(request, response) {
  var query = new Parse.Query("Favoritos");
  query.equalTo("from", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.objectId
  });
  query.include("user");
  query.include("user.pais");

  query.find({
    success: function(favs) {
      var resultados = [];
      for (var i = 0; i < favs.length; i++) {
        var resultado = (favs[i].toJSON());
        var user = favs[i].get("user");
        var pais = user.get("pais");
        resultado["user"] = user;
        resultado["pais"] = pais;
        resultados.push(resultado);
      }
      response.success(resultados);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

Parse.Cloud.define("favoriteAudio", function (request, response) {
  var Favoritos = Parse.Object.extends("Favoritos");
  var fav = new Favoritos();

  fav.set("from", Parse.User.current());
  fav.set("to", request.params.audio);

  fav.save(null, {
    success: function() {
      response.success(true);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

Parse.Cloud.afterSave("Favoritos", function(request) {
  var audioId = request.object.get("from").id;
  var Audio = Parse.Object.extend("Audios");
  var queryAudio = new Parse.Query(Audio);

  var user = Parse.User.current();

  queryAudio.get(audioId).then( function(audio) {
    audio.increment("favoritos");
    audio.save();
  }, function(error) {
    throw "Got an error " + error.code + " : " + error.message;
  });

  user.increment("favoritos");
  user.save();
});
