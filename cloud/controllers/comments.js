//Obtenemos los comentarios y el usuario de un determinado audio
Parse.Cloud.define("listComments", function(request, response) {
  var query = new Parse.Query('Comentarios');
  query.equalTo("toAudio", {
    __type: "Pointer",
    className: "Audios",
    objectId: request.params.toAudio
  });
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
