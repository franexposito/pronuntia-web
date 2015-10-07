//Obtenemos los comentarios y el usuario de un determinado audio
Parse.Cloud.define("listComments", function(request, response) {
  var query = new Parse.Query('Comentarios');
  var Audio = Parse.Object.extend('Audio');
  query.equalTo("toAudio", new Audio({id: request.params.toAudio}));
  //incluimos el audio
  query.include("toAudio");
  //incluimos el usuario
  query.include("fromId");

  query.find({
    success: function(comentario) {
      response.success(comentario);
    },
    error: function(error) {
      response.error(error);
    }
  });
});
