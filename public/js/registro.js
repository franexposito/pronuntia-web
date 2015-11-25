var idio = false;
var array_idiomas = [];
var selected = 0;
var li_selected;

var array_provincia = [];
var provincia = 0;

var sexo;
var sex_selected;

var usuario;

var up = false;

var image;

var monigoteE;

//Funcion llamada antes de enviar el avatar del usuario o la organizacion
//La funcion tiene dos parametros:
// img = input donde está la imagen
// com = contenedor donde mostrar los mensajes de error o exito
function beforeSubmit(img, com) {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    //comprobamos si hay una imagen. En caso negativo no seguimos con el proceso
    if (!$(img).val()) {
      return false;
    }
    //obtenemos el formato y el tamaño de la imagen
    var fsize = $(img)[0].files[0].size;
    var ftype = $(img)[0].files[0].type;

    //Comprobamos si tiene un formato adecuado. En caso negativo no seguimos con el proceso
    switch (ftype) {
      case 'image/png': case 'image/jpeg': case 'image/jpg': break;
      default:
        return false;
    }

    //Comprobamos si tiene un tamaño adecuado. En caso negativo no seguimos con el proceso
    if (fsize > 2097152) {
      return false;
    }

    return true;

  } else {
    return false;
  }

}

function getImage(input) {
  if (beforeSubmit(input)) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#preview').attr('src', e.target.result);
        $('.final-botton .btn-img').removeClass('disabled');
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
}

$(document).ready(function () {
  $('#registro-form').validate({
    rules: {
      username_p: {
        required: true
      },
      c1: {
        required: true,
        minlength: 6,
        maxlength: 20
      },
      c2: {
        required: true,
        equalTo: "#c1"
      },
      mail: {
        required: true,
        email: true
      }
    },
    messages: {
      username_p: {
        required: "Tienes que rellenar este campo"
      },
      c1: {
        required: "Tienes que rellenar este campo",
        minlength: "La contraseña debe tener entre 6 y 20 caracteres",
        maxlength: "La contraseña debe tener entre 6 y 20 caracteres"
      },
      c2: {
        required: "Tienes que rellenar este campo",
        equalTo: "Las contraseñas no coinciden"
      },
      mail: {
        required: "Tienes que rellenar este campo",
        email: "No es un email válido"
      }
    },
    errorPlacement: function (error, element) {
      $(element).parent().children('.dot').addClass('error-d');
      $(element).parent().append(error);
    },

    //Esta funcion se encarga de cambiar el color de la frase cuando esta correcto
    success: function(label, element) {
      $(element).parent().children('.dot').removeClass('error-d');
      $(label).remove();
      console.log(element);
    },
    
    submitHandler: function (form) {
      if (provincia === 0) {
        $('#loc_error').fadeIn();
        if (selected.length === 0) {
          $('#lm_error').fadeIn();
        }
      } else {
        $('.error_block').hide();

        var userN = $('#username_p').val();
        var pass = $('#c1').val();
        var mail = $('#mail').val();

        var num = 0;
        var user = new Parse.User();
        user.set("username", userN);
        user.set("password", pass);
        user.set("email", mail);
        var Pais = Parse.Object.extend('Pais');
        user.set("pais", new Pais({id: selected.id}));
        user.set("isFacebook", false);
        user.set("sexo", sexo);
        user.set("pueblo", provincia['pueblo']);
        user.set("provincia", provincia['provincia']);
        user.set("region", provincia['region']);

        user.set("seguidores", num);
        user.set("siguiendo", num);
        user.set("favoritos", num);
        user.set("audios", num);

        user.signUp(null).then(function(user) {
          usuario = user;
          return Parse.User.logIn(userN, pass);
        }).then( function(result) {
          $('.registro-cont').fadeOut();
          setTimeout($('.foto-cont').fadeIn(), 500);
        }, function (e) {
          if (e.code === 202) {
            $('#user_error').fadeIn();
          } 
          else if (e.code === 203) {
            $('#em_error').fadeIn();
          }
          else {
            alert('Ha habido un error, inténtelo de nuevo más tarde');
          }
        });
      }
    },
    error: function(error) {
      alert('Ha habido un error, inténtelo de nuevo más tarde');
    }
  });

  $('.form-control').on('focusout', function () {
    $(this).parent().children('.dot').removeClass('active');
  });

  $('.form-control').on('focus', function () {
    $(this).parent().children('.dot').addClass('active');
  });

  $('#materna').on('change', function (evt) {
    var idio = $(this).val();
    $(this).css('color', '#00a8f0');
    array_idiomas = [];
    $('.banderas').slideUp();
    $('.banderas').html('');
    $('.banderas').append('<h1>Selecciona tu pais</h1>');
    $('.ld').show();

    Parse.Cloud.run('getContriesLan', { idioma: idio }, {
      success: function (paises) {
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
      error: function (error) {
        alert('Ha habido un error');
      }
    });
  });

  $('.banderas').on('click', '.country', function () {
    if (!$('#pro').is(":visible")) {
      $('#pro').fadeIn();
    }

    if (li_selected) {
      $(li_selected).removeClass('selected');
    }

    li_selected = this;
    $(this).addClass('selected');
    var index = $(this).children('a').data('array');
    selected = array_idiomas[index];
  });

  $('.banderas').on('click', 'a', function (evt) {
    evt.preventDefault();
  });

  $('.btn-provincia').on('click', function (evt) {
    evt.preventDefault();
    $.ajax({
      dataType: "jsonp",
      url: 'http://taggie.me/pronuntia/geocode.php?country='+selected.get("name")+'&input=' +$("#provincia").val()+ '&language=' +selected.get("code")+'',
      success: function(data) {
        if (data.length == 1) {
          if ($('.provincias').is(':visible')) { $('.provincias').slideUp(); }
          provincia = data[0];
          $('#provincia').val(provincia.pueblo + ', ' + provincia.provincia + ', ' + provincia.region);
        }
        else if (data.length > 1) {
          var i = 0;
          $('.provincias').html('');
          $('.provincias').append('<h1>Selecciona tu localizacion</h1>');
          data.forEach(function (p) {
            array_provincia.push(p);
            $('.provincias').append('<li class><a data-array="'+i+'" href="#">'+p["pueblo"]+', '+p["provincia"]+', '+p["region"]+'</a></li>');
            i++;
            if (i >= data.length-1) {
              $('.provincias').slideDown();
            }
          });
        } else {
          $('#loc_error').fadeIn();
        }
      }
    });
  });

  $('.provincias').on('click', 'a', function (evt) {
    evt.preventDefault();
    $('.provincias').slideUp();
    provincia = array_provincia[$(this).data("array")];
    $('#provincia').val(provincia.pueblo + ', ' + provincia.provincia + ', ' + provincia.region);
  });

  $('.sexo').on('click', 'a', function (evt) {
    evt.preventDefault();
    $(sex_selected).removeClass('selected');
    $(this).addClass('selected');
    sexo = $(this).data('sexo');
    sex_selected = $(this);
  });

  $('.final-botton .btn-img').on('click', function() {
    var fileUploadControl = $("#imgInp")[0];
    var parseFile = new Parse.File(fileUploadControl.files[0].name, fileUploadControl.files[0]);

    parseFile.save().then(function(im) {
      var data = {
        monigoteBool: false,
        imageprofile: im
      };
      return Parse.Cloud.run('setImageFromUser', data);
    }).then( function(user) {
      window.location.href = "http://pronuntia.parseapp.com/" + usuario.get('username');
    }, function(error) {
      alert('Ha ocurrido un error');
    });

  });

  $("#imgInp").on('change', function() {
    getImage(this);
  });

  $('.monigote-btn .btn-img').on('click', function() {
    var data = {
      monigoteBool: true,
      monigoteElegido: monigoteE
    };

    Parse.Cloud.run('setImageFromUser', data, {
      success: function(user) {
        window.location.href = "http://pronuntia.parseapp.com/" + usuario.get('username');
      },
      error: function (error) {
        alert('Ha habido un error');
      }
    });
  });

  $('.monigotes-cont').on('click', 'a', function(evt) {
    evt.preventDefault();
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    monigoteE = $(this).data('id');
    if ($('.monigote-btn .btn-img').hasClass('disabled')) { $('.monigote-btn .btn-img').removeClass('disabled'); }
  });

  $('.close_x').on('click', function(evt) {
    evt.preventDefault();   
    $(this).parent().fadeOut();
  });

  $('#username_p').on('focusout', function() {
    if ( $('#user_error').is(':visible') ) {
      Parse.Cloud.run('existsUserWithUsername', {'username': $('#username_p').val()}, {
        success: function(resp) {
          if (resp === false) {
            $('#user_error').fadeOut();
          }
        },
        error: function(error) {

        }
      });
    }
  });

  $('#mail').on('focusout', function() {
    if ( $('#em_error').is(':visible') ) {
      Parse.Cloud.run('existsUserWithEmail', {'email': $('#mail').val()}, {
        success: function(resp) {
          if (resp === false) {
            $('#em_error').fadeOut();
          }
        },
        error: function(error) {

        }
      });
    }
  });
});
