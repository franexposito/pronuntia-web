//Obtenemos todos los monigotes
Parse.Cloud.define("getMonigotes", function(request, response) {
  var query = Parse.Query("Monigotes");
  query.find({
    success: function(result) {
      response.success(result);
    },
    error: function(error) {
      response.error("Error Message:" + error.code + " " + error.message);
    }
  });
});
