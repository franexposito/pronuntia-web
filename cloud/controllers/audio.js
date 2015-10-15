var _ = require('underscore');

//Obtengo todos los Audios
Parse.Cloud.define("listAudios", function(request, response) {
  var query = new Parse.Query("Audios");
  query.include(["user", "user.pais"]);
  query.find({
    success: function(audios) {
      var resultados = [];
      for (var i = 0; i < audios.length; i++) {
        var resultado = (audios[i].toJSON());
        var user = audios[i].get("user");
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

//Obtengo todos los Audios version para Android
Parse.Cloud.define("listAudiosMobile", function(request, response) {
  var audios;
  var likes;
  var favs;
  var idUser = Parse.User.current();

  var queryA = new Parse.Query("Audios");
  queryA.include(["user", "user.pais"]);

  queryA.find().then(function(audiosT) {
    audios = audiosT;
    var queryM = new Parse.Query("MeGusta");
    queryM.equalTo("from", idUser);
    return queryM.find();
  }).then(function(likesT) {
    likes = likesT;
    var queryF = new Parse.Query("Favoritos");
    queryF.equalTo("from", idUser);
    return queryF.find();
  }).then(function(favsT) {
    favs = favsT;
  }).then(function() {
    for (var i = 0; i < audios.length; i++) {
      audios["megusta"] = false;
      audios["favorito"] = false;
      var idAudio = audios[i].get("user").id;
      for (var j = 0; j < likes.length; j++) {
        if (idAudio == likes[j].get("from").id) {
          audios["megusta"] = true;
          break;
        }
      }
      for (var g = 0; g < favs.length; g++) {
        if (idAudio == likes[g].get("from").id) {
          audios["favorito"] = true;
          break;
        }
      }
      var user = audios[i].get("user");
      var pais = user.get("pais");
    }
    response.success(audios);
  }, function(error) {
    response.error({'resp': error.code, 'message': error.message});
  });
});

//Almacenamos un Audio creado por el actual usuario
Parse.Cloud.define("addAudio", function(request, response) {
  var Audios = Parse.Object.extend("Audios");
  var audio = new Audios();

  var name = Parse.User.current().get("username") + "_" +  Parse.User.current().id + request.params.palabra + ".ogg";
  var source = new Parse.File(name, request.params.source);
  audio.set("file", source);
  audio.set("pais", Parse.User.current().get("pais"));
  audio.set("palabra", request.params.palabra);
  audio.set("user", Parse.User.current());
  audio.set("tipo", request.params.tipo);

  audio.set("me_gusta", 0);
  audio.set("escuchado", 0);
  audio.set("favoritos", 0);

  var permisos = new Parse.ACL(Parse.User.current());
  permisos.setPublicReadAccess(true);
  audio.setACL(permisos);

  audio.save(null, {
    success: function(audio) {
      response.success(true);
    },
    else: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

Parse.Cloud.afterSave("Audios", function(request) {
  var user = Parse.User.current();
  user.increment("audios");
  user.save();
});

//Obtengo todos los Audios de los usuarios
Parse.Cloud.define("getAudioFromUser", function(request, response) {
  var query = new Parse.Query("Audios");
  query.equalTo("user", request.params.user);
  query.find({
    success: function(audios) {
      response.success(audios);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});
