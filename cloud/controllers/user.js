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
      user.set("imageprofile", undefined);
    }
  } else {
    if (request.params.imageprofile != null) {
      user.set("monigote", undefined);
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
  query.include("monigote");
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

//Introducimos la bio
Parse.Cloud.define("setBio", function(request, response) {
  var user = Parse.User.current();
  user.set("bio", request.params.bio);

  user.save(null, {
    success: function(user) {
      response.success(true);
    },
    error: function(error) {
      response.error({'resp': error.code, 'message': error.message});
    }
  });
});

//Registro desde web
Parse.Cloud.define("signUpWeb", function(request, response) {
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

  user.signUp(null, {
    success: function(user) {
      response.success(true);
    },
    error: function(user, error) {
      response.error("Error Message:" + error.code + " " + error.message);
    }
  });

});

Parse.Cloud.define("setImageFromUser", function (request, response) {
  var user = Parse.User.current();
  if (request.params.monigoteBool == true) {
    if (request.params.monigoteElegido != null ) {
      var Monigotes = Parse.Object.extend('Monigotes');
      user.set("monigote", new Monigotes({id: request.params.monigoteElegido}));
      user.set("imageprofile", undefined);
    }
  } else {
    if (request.params.imageprofile != null) {
      user.set("monigote", undefined);
      user.set("imageprofile", request.params.imageprofile);
    }
  }

  user.save(null, {
    success: function(user) {
      response.success(true);
    },
    error: function(error) {
      response.error("Error Message:" + error.code + " " + error.message);
    }
  });
});
/*************************************************************************************/
exports.profile = function (req, res) {
  var query = new Parse.Query(Parse.User);
  var userF;
  var audiosArray = [];

  query.include("pais");
  query.include("monigote");
  query.equalTo("username", req.params.username);
  query.first().then( function(user) {
    userF = user;
    var queryAudio = new Parse.Query("Audios");
    queryAudio.include("pais");
    queryAudio.equalTo("user", user);
    return queryAudio.find();
  }).then(function(audio) {
    res.render('perfil/profile', {usuario: userF, audios: audio});
    //res.send(userF);
  }, function() {
    res.send(500, 'User not found');
  });
}
