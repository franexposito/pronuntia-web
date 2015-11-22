var audioContext;
var recorder;
var numberWords = 0;
var user;
var palabra;
var url = window.location.href 

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
      palabra = p;
      $wor.html(p[0].get("palabra"));
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
    $recordb.attr('disabled', false);
    $stopb.attr('disabled', true);
    $deleb.attr('disabled', true);
    /*Parse.Cloud.run('setAudioFromPalabra', {megaBuffer: megaB}, {
      success: function(c) {
        changePalabra();
      },
      error: function(error) {
        alert('Tenemos algunos problemas, actualiza la página e inténtalo de nuevo');
      }
    });*/
  });

});

function saveRecording(blob) {
  var url = URL.createObjectURL(blob),
      html = "<p recording='" + url + "'><audio controls src='" + url + "'></audio></p>";
  $recL.append($(html));
}

function setHandlers() {
  recorder.onTimeout = function(recorder) {
    recorder.stopRecording();
  };

  recorder.onEncodingProgress = function(recorder, progress) {

  };

  recorder.onComplete = function(recorder, blob) {
    saveRecording(blob);
    changePalabra();
  };

  recorder.onError = function(recorder, message) {

  };
  
  recorder.onConsole = function(recorder, message) {
    console.log("Mensaje del codificador: " + message);
  }
}