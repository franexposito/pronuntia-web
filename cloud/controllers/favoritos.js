//Obtenemos todos los audios de un objectId
Parse.Cloud.define("getFavoriteAudiosFromUserId", function(request, response) {
  var query = new Parse.Query("Favoritos");
  query.equalTo("to", {
    __type: "Pointer",
    className: "User",
    id: request.params.objectId
  });
  query.include("user");
  query.include("user.pais");

  query.find({
    success: function(result) {
      response.success(result);
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
