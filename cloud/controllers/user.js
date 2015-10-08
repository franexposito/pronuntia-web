var _ = require('underscore');

//Registra un usuario
Parse.Cloud.define("registro", function(request, response) {
  var user = new Parse.User();
  user.set("username", request.params.username);
  user.set("password", request.params.password);
  user.set("email", request.params.email);
  var Pais = Parse.Object.extend('Pais');
  user.set("pais", new Pais({id: request.params.pais}));
  user.set("isFacebook", request.params.isFacebook);
  user.set("sexo", request.params.sexo);
  user.set("pueblo", request.params.pueblo);
  user.set("provincia", request.params.provincia);
  user.set("region", request.params.region);

  user.set("seguidores", 0);
  user.set("siguiendo", 0);
  user.set("favoritos,", 0);
  user.set("audios", 0);

  if (request.params.monigoteBool) {
    var Monigotes = Parse.Object.extend('Monigotes');
    user.set("monigote", new Monigotes({id: request.params.monigoteElegido}));
    user.set("imageprofile", null);
  } else {
    user.set("monigote", null);
    var myImageProfile = new Parse.File("avatar.png", request.params.imageprofile);
    user.set("imageprofile", myImageProfile);
  }

  user.signUp(null, {
    success: function(user) {
      response.success(true);
    },
    error: function(user, error) {
      response.error("Error Message:" + error.code + " " + error.message);
    }
  });
});

//Comprueba si existe un usuario con el email pasado por parametro
Parse.Cloud.define("existsUserWithEmail", function(request, response) {
  var query = new Parse.Query(Parse.User);
  query.equalTo("email", request.params.email);
  query.count({
    success: function(results) {
      if (results > 0) {
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

//Comprueba si existe un usuario con el username pasado por parametro
Parse.Cloud.define("existsUserWithUsername", function(request, response) {
  var query = new Parse.Query(Parse.User);
  query.equalTo("username", request.params.username);
  query.count({
    success: function(results) {
      if (results > 0) {
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

//Obtenemos un usuario cuyo objectId sea igual al pasado por parametro
Parse.Cloud.define("getUserByObjectId", function(request, response) {
  var query = new Parse.Query(Parse.User);
  query.get(request.params.objectId, {
    success: function(result) {
      if (results.length > 0) {
        response.success(result[0]);
      } else {
        response.success(false);
      }
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

//Obtenemos todos los audios de un usuario
Parse.Cloud.define("getAudiosFromUser", function(request, response) {
  var query = new Parse.Query("Audios");
  query.equalTo("user", request.params.user);
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

//Obtenemos todos los audios de un objectId
Parse.Cloud.define("getFavoriteAudiosFromUserId", function(request, response) {
  var query = new Parse.Query(Parse.User);
  query.equalTo("favoritos", request.params.objectId);
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

//Aumentamos el numero de seguidores
Parse.Cloud.define("aumentar", function(request, response) {
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
