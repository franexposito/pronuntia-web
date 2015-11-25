var audioContext;
var recorder;
var numberWords = 0;
var user;
var palabra;
var url = window.location.href;
var blobs = [];
var index = 0;

/********
Buttons and elements
********/
var $recordb = $('.btn-record');
$stopb = $('.btn-stop');
$dur = $('.dur');
$deleb = $('.btn-dele');
$pbar = $('.progress-bar');
$wor = $('#wor');
$recL = $('.record-list');


function startUserMedia(stream) {
  var input = audioContext.createMediaStreamSource(stream);
  recorder = new pronuntiaRecorder(input, {
    numChannels: 1,
    sampleRate: input.context.sampleRate
  });

  setHandlers();
  window.setInterval(updateTime, 200);
}

function getNumberWords() {
  Parse.Cloud.run('getNumbersWords', {}, {
    success: function(c) {
      numberWords = c;
      user = Parse.User.current();
      changePalabra();
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
      palabra = p[0].get("palabra");
      $wor.html(p[0].get("palabra"));
      $recordb.attr("disabled", false);
    },
    error: function(error) {
      alert('Tenemos algunos problemas, actualiza la página e intentalo de nuevo');
    }
  });

}

function minSecStr(n) { return (n < 10 ? "0" : "") + n; };

function putProgressBar(sec) {
  $pbar.attr('aria-valuenow', sec);
  $pbar.css("width", sec+"%");
}

function updateTime() {
  var sec = recorder.recordingTime() | 0;
  putProgressBar(sec);
  $dur.html(minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60));
};

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = ( navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);
    window.URL = window.URL || window.webkitURL;

    audioContext = new AudioContext;
  } catch (e) {
    alert('No web audio support in this browser!');
  }

  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {});

};

$(document).ready( function() {

  if(!Parse.User.current()) { window.location.href = "http://pronuntia.parseapp.com/"; } 

  getNumberWords();

  $recordb.on('click', function(evt) {
    recorder.startRecording();
    $recordb.attr('disabled', true);
    $stopb.attr('disabled', false);
    $deleb.attr('disabled', false);
  });

  $stopb.on('click', function(evt) {
    recorder.stopRecording();
    $stopb.attr('disabled', true);
    $deleb.attr('disabled', true);
  });

  $('.record-list').on('click', '.btn-dele', function() {
    $(this).parent().parent().hide();
  });

  $('.record-list').on('click', '.btn-save', function() {
    var p = $(this).parent().parent();
    var ind = parseInt($(p).data('index'));
    var read = new FileReader();  
    read.onload = function() {
      var audio = read.result;
      var data = {
        'palabra': $(p).data('wor'),
        'source': audio,
        'tipo': 1
      };
      

      var loader = $(p).children('.loader').children('img');
      $(loader).show();
      $(this).attr('disabled', true);
      $(p).children('.bt').children('.btn-dele').attr('disabled', true);
      Parse.Cloud.run('addAudioWeb', data, {
        success: function(c) {
          $(loader).hide();
          $(loader).parent().append('<p>ok</p>');
        },
        error: function(error) {
          alert('Tenemos algunos problemas, actualiza la página e inténtalo de nuevo');
        }
      }); 
    }
    
    read.readAsDataURL(blobs[ind]);
  });
});

function saveRecording(blob) {
  var url = URL.createObjectURL(blob),
      html = '<div class="audio-g"><div data-index="'+index+'" data-wor="'+palabra+'" class="row-height">' 
  + '<div class="col-xs-3 col-height"><h2>'+palabra+'</h2></div>' 
  + '<div class="col-xs-6 col-height ad"><audio controls src="'+ url +'"></audio></div>' 
  + '<div class="col-xs-1 col-height bt"><button class="btn btn-default btn-save"><i class="fa fa-cloud fa-fw"></i></button></div>' 
  + '<div class="col-xs-1 col-height bt"><button class="btn btn-default btn-dele"><i class="fa fa-times fa-fw"></i></button></div>'
  + '<div class="col-xs-1 col-height bt loader"><img src="/img/loader.gif"></div>' 
  + '</div></div>';
  $recL.append($(html));
}

function setHandlers() {
  recorder.onTimeout = function(recorder) {
    recorder.stopRecording();
  };

  recorder.onEncodingProgress = function(recorder, progress) {

  };

  recorder.onComplete = function(recorder, blob) {
    blobs.push(blob);
    saveRecording(blob);
    index++;
    changePalabra();
  };

  recorder.onError = function(recorder, message) {

  };

  recorder.onConsole = function(recorder, message) {
    console.log("Mensaje del codificador: " + message);
  }
}