var _ = require('underscore');

//Registra un usuario
Parse.Cloud.define("signUp", function(request, response) {
  var num = 0;
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

  user.set("seguidores", num);
  user.set("siguiendo", num);
  user.set("favoritos", num);
  user.set("audios", num);

  if (request.params.monigoteBool == true) {
    if (request.params.monigoteElegido != null ) {
      var Monigotes = Parse.Object.extend('Monigotes');
      user.set("monigote", new Monigotes({id: request.params.monigoteElegido}));
      user.set("imageprofile", null);
    }
  } else {
    if (request.params.imageprofile != null) {
      user.set("monigote", null);
      var myImageProfile = new Parse.File("avatar.png", request.params.imageprofile);
      user.set("imageprofile", myImageProfile);
    }
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
  query.include("pais");
  query.get(request.params.objectId, {
    success: function(result) {
      if (result) {
        response.success(result);
      } else {
        response.success(null);
      }
    },
    error: function(error) {
      response.error({'message': error.message});
    }
  });
});