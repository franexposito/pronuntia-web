//Obtenemos todos los audios de un objectId
Parse.Cloud.define("getFavoriteAudiosFromUserId", function(request, response) {
  var query = new Parse.Query("Favoritos");
  query.equalTo("from", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.objectId
  });
  
  //query.include("from");
  //query.include("from.monigote");
  //query.include("from.pais");
  query.include("to");
  query.include("to.user");
  query.include("to.user.monigote");
  query.include("to.user.pais");

  query.find({
    success: function(favs) {
      response.success(favs);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

Parse.Cloud.define("favoriteAudio", function (request, response) {
  var Favoritos = Parse.Object.extend("Favoritos");
  var fav = new Favoritos();

  fav.set("from", Parse.User.current());
  fav.set("to", {
    __type: "Pointer",
    className: "Audio",
    objectId: request.params.audio
  });

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

Parse.Cloud.define("disFavoriteAudio", function (request, response) {
  var query = new Parse.Query("Favoritos");
  query.equalTo("from", Parse.User.current());
  query.equalTo("to", request.params.audio);

  query.find({
    success: function(fav) {
      fav.destroy({
        success: function() {
          response.success(true);
        },
        error: function(error2) {
          response.error("Error Message:" + error2.code + " " + error2.message);
        }
      });
    },
    error: function(error1) {
      response.error("Error Message:" + error1.code + " " + error1.message);
    }
  });
});

Parse.Cloud.afterDelete("Favoritos", function(request) {
  var audioId = request.object.get("to").id;

  var Audio = Parse.Object.extend("Audios");
  var query = new Parse.Query(Audio);
  query.get(audioId).then( function(audio) {
    audio.decrement("favoritos");
    audio.save();
  }, function(error) {
    throw "Got an error " + error.code + " : " + error.message;
  });
});

