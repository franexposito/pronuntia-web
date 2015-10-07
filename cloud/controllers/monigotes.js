Parse.Cloud.define("getMonigotes", function(request, response) {
  var monigote = Parse.Object.extend("Monigotes");
  var query = Parse.Query("monigote");
  query.find({
    success: function(result) {
      response.success(result);
    },
    error: function(error) {
      response.error("Error Message:" + error.code + " " + error.message);
    }
  })
});
