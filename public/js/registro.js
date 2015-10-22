var idio = false;
var array_idiomas = [];
var selected;
var li_selected;

$(document).ready(function () {
  $('.form-control').on('focusout', function () {
    $(this).parent().children('.dot').removeClass('active');
  });

  $('.form-control').on('focus', function () {
    $(this).parent().children('.dot').addClass('active');
  });


  $('#registro-form').validate({
      rules: {
        username_p: {
          required: true
        },
        c1: {
          required: true
        },
        c2: {
          required: true,
          minlength: 6,
          maxlength: 20
        },
        repetirContrasenaR: {
            required: true,
            equalTo: "#c1"
        },
        mail: {
            required: true,
            email: true,
        },
        sexo: {
          required: true
        },
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
  
  $('#materna').on('change', function(evt) {
    var idio = $(this).val();
    $(this).css('color', '#00a8f0');
    array_idiomas = [];
    $('.banderas').slideUp();
    $('.banderas').html('');
    $('.banderas').append('<h1>Selecciona tu pais</h1>');
    $('.ld').show();
      
    Parse.Cloud.run('getContriesLan', { idioma: idio }, {
    success: function(paises) {
      var i = 0;
      paises.forEach(function (p) {
        array_idiomas.push(p);
        $('.banderas').append('<li class="country"><a data-array="'+i+'" href="#"><img src="'+p.get("bandera_file").url()+'"><p>'+p.get("name")+'</p></a></li>');
        i++;
        if (i >= paises.length-1) { 
          $('.ld').hide();
          $('.banderas').slideDown(); 
        }
      });
    },
    error: function(error) {
      alert('Ha habido un error');
    }
    });
  });
  
  $('.banderas').on('click', '.country', function() {
    if (!$('#pro').is(":visible")) {
      $('#pro').fadeIn();
    }
    
    if (li_selected) {
      $(li_selected).css('background', '#fff');
    }
    
    li_selected = this;
    $(this).css('background', '#f9f9f9');
    var index = $(this).children('a').data('array');
    var selected = array_idiomas[index];
  });

  $('.banderas').on('click', 'a', function(evt) {
    evt.preventDefault();
  });

  $('#provincia').on('focusout', function(evt) {
    $.ajax({
      url: 'taggie.me/pronuntia/geocode.php?country='+selected.get("name")+'&input='+$("#provincia").val()+'&language='+selected.get("code")+''
    });
  });

});