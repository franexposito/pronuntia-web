Parse.Cloud.define("likeAudio", function(request, response) {
  var MeGusta = Parse.Object.extends("MeGusta");
  var gusta = new MeGusta();

  gusta.set("from", Parse.User.current());
  gusta.set("to", request.params.audio);

  gusta.save(null, {
    success: function() {
      response.success(true);
    },
    error: function(error) {
      response.error("Error Message:" + error.code + " " + error.message);
    }
  });
});

Parse.Cloud.afterSave("MeGusta", function(request) {
  var audioId = request.object.get("to").id;

  var Audio = Parse.Object.extend("Audios");
  var query = new Parse.Query(Audio);
  query.get(audioId).then( function(audio) {
    audio.increment("me_gusta");
    audio.save();
  }, function(error) {
    throw "Got an error " + error.code + " : " + error.message;
  });
});

Parse.Cloud.define("dislikeAudio", function(request, response) {
  var query = new Parse.Query("MeGusta");
  query.equalTo("from", Parse.User.current());
  query.equalTo("to", request.params.audio);

  query.find({
    success: function(megusta) {
      megusta.destroy({
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

Parse.Cloud.afterDelete("MeGusta", function(request) {
  var audioId = request.object.get("to").id;

  var Audio = Parse.Object.extend("Audios");
  var query = new Parse.Query(Audio);
  query.get(audioId).then( function(audio) {
    audio.decrement("me_gusta");
    audio.save();
  }, function(error) {
    throw "Got an error " + error.code + " : " + error.message;
  });
});
