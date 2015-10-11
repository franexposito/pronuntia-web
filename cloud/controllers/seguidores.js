//Obtenemos nuestros seguidores
Parse.Cloud.define("listOfUsersFollowingTo", function(request, response) {
  var query = new Parse.Query("Seguidores");
  query.equalTo("from", {
    __type: "Pointer",
    className: "User",
    id: request.params.objectId
  });

  query.find({
    success: function(seguidores) {
      response.sucess(seguidores);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

//Obtenemos la gente que nos sigue
Parse.Cloud.define("listOfUserWhoAreFollowingMe", function(request, response) {
  var query = new Parse.Query("Seguidores");
  query.equalTo("to", {
    __type: "Pointer",
    className: "User",
    id: request.params.objectId
  });
});

//Aumentamos el numero de seguidores
Parse.Cloud.define("aumentar", function(request, response) {
  Parse.Cloud.useMasterKey();
  var query = new Parse.Query(Parse.User);
  query.get(request.params.objectId, {
    success: function(user) {
      user.increment("seguidores");
      user.save();
      response.success(user.get("seguidores"));
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});
