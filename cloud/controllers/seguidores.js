//Obtenemos nuestros seguidores
Parse.Cloud.define("listOfUsersFollowingTo", function(request, response) {
  var query = new Parse.Query("Seguidores");

  query.equalTo("from", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.objectId
  });

  query.include(["from", "from.monigote", "from.pais", "to", "to.pais", "to.monigote"]);


  query.find({
    success: function(seguidores) {
      response.success(seguidores);
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
    className: "_User",
    objectId: request.params.objectId
  });

  query.include(["from", "from.monigote", "from.pais", "to", "to.pais", "to.monigote"]);

  query.find({
    success: function(seguidores) {
      response.success(seguidores);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
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

Parse.Cloud.define("amIfollowingTo", function(request, response) {
  var query = new Parse.Query("Seguidores");
  query.equalTo("to", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.objectId
  });
  
  query.equalTo("from", Parse.User.current());
 
  query.count({
    success: function(count) {
      if (count > 0) {
        response.success(true);
      } else {
        response.success(false);
      }
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});
