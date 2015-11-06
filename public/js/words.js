var audio_context;
var recorder;
var numberWords = 0;
var user;
var palabra;

function getNumberWords() {
  Parse.Cloud.run('getNumbersWords', {}, {
    success: function(c) {
      numberWords = c;
      user = Parse.User.current();
      changePalabra();
      console.log(numberWords);
    },
    error: function(error) {
      alert('Tenemos algunos problemas, actualiza la página e inténtalo de nuevo');
    }
  });
}

function changePalabra() {
  var idioma = user.get('pais').get('idioma').toLowerCase();
  var query = new Parse.Query('Palabras');
  query.equalTo('idioma', idioma);
  query.skip(parseInt(Math.random()*numberWords));
  query.limit(1);
  query.find({
    success: function(p) {
      palabra = p;
      document.getElementById('spinner').innerHTML = p[0].get("palabra");
    },
    error: function(error) {
      alert('Tenemos algunos problemas, actualiza la página e intentalo de nuevo');
    }
  });
    
  document.getElementById('spinner').innerHTML = "<img src=\"https://www.brown.edu/sites/default/themes/pawtuxet/img/loader-larger.gif\" width=\"100\" height=\"100\">";
}

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  recorder = new Recorder(input, {numChannels: 1});
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext;
  } catch (e) {
    alert('No web audio support in this browser!');
  }

  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    console.log('No live audio input: ' + e);
  });
};

$(document).ready( function() {
  
  getNumberWords();
  

  $('.btn-record').on('click', function(evt) {
    evt.preventDefault();
    recorder && recorder.record();
    $(this).addClass('disabled');
    $('.btn-stop').removeClass('disabled');
  });

  $('.btn-stop').on('click', function(evt) {
    recorder && recorder.stop();
    $(this).addClass('disabled');
    $('.btn-record').removeClass('disabled');

    recorder.clear();
      
    changePalabra();
  });
  
});