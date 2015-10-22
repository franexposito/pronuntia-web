$(document).ready(function () {
  $('.form-control').on('focusout', function () {
    $(this).parent().children('.dot').removeClass('active');
  });

  $('.form-control').on('focus', function () {
    $(this).parent().children('.dot').addClass('active');
  });

  $('#login-form').validate({
    rules: {
      username_p: "required",
      c1: "required"
    },
    messages : {
      username_p: "Introduce un usuario",
      c1: "Introduce tu contraseña"
    },
    submitHandler: function (form) {
      var username = $('#username_p').val();
      var pass = $('#c1').val();

      Parse.User.logIn(username, pass, {
        success: function(user) {
          alert("todo salio fetén");
        },
        error: function(user, error) {
          alert("No intentes engañarme");
        }
      });
    }
  });

});
