//Obtenemos todos los paises
Parse.Cloud.define("getCountries", function(request, response) {
  var query = new Parse.Query("Pais");
  query.find({
    success: function(result) {
      response.success(result);
    },
    error: function(error) {
      response.error("Error Message:" + error.code + " " + error.message);
    }
  });
});
