importScripts("OggVorbisEncoder.min.js");

var sampleRate = 44100,
    numChannels = 2,
    options = undefined,
    maxBuffers = undefined,
    encoder = undefined,
    recBuffers = undefined,
    bufferCount = 0,
    recLength = 0;

function error(message) {
  self.postMessage({ command: "error", message: "ogg: " + message });
}

function init(data) {
  sampleRate = data.config.sampleRate;
  numChannels = data.config.numChannels;
  options = data.options;
};

function setOptions(opt) {
  if (encoder || recBuffers)
    error("cannot set options during recording");
  else
    options = opt;
}

function start(bufferSize) {
  maxBuffers = Math.ceil(options.timeLimit * sampleRate / bufferSize);
  if (options.encodeAfterRecord) {
    recBuffers = [];
  } else {
    encoder = new OggVorbisEncoder(sampleRate, numChannels, options.ogg.quality);
  }
}

function record(buffer) {
  if (bufferCount++ < maxBuffers) {
    if (encoder)
      encoder.encode(buffer);
    else {
      for (var i = 0; i < buffer[0].length; i++)
        recBuffers.push(buffer[0][i]);
      recLength += buffer[0].length;
    }

  } else
    self.postMessage({ command: "timeout" });
};

function postProgress(progress) {
  self.postMessage({ command: "progress", progress: progress });
};

function cutAudio() {
  self.postMessage({ command: "console", data: "Tamaño inicio: " + recBuffers.length});
  var startpoint = 0;
  var endpoint = recBuffers.length;
  for (var i = startpoint; i < recBuffers.length; i = i + 4096) {
    var buffer = recBuffers.slice(i, i + 4096);
    var suma = 0;
    for (var j = 0; j < buffer.length; j++) {
      suma += Math.abs(parseFloat(buffer[j]));
    }
    if (suma >= 15) {
      startpoint = i;
      break;
    }
  }

  for (var i = endpoint-4096-1; i >= 0; i = i - 4096) {
    var buffer = recBuffers.slice(i, i + 4096);
    var suma = 0;
    for (var j = 0; j < buffer.length; j++) {
      suma += Math.abs(parseFloat(buffer[j]));
    }
    if (suma >= 15) {
      self.postMessage({ command: "console", data: "Suma: " + suma});
      endpoint = i;
      break;
    }
  }

  recBuffers = recBuffers.slice(startpoint, endpoint);
  
  self.postMessage({ command: "console", data: "Tamaño final: " + recBuffers.length});
  recBuffersAux = []
  var buffer = [];
  while (recBuffers.length > 0) {
    buffer.push(recBuffers.shift());
    if (buffer.length == 4096) {
      recBuffersAux.push(buffer);
      buffer = [];
    }
  }
  
  if (buffer.length > 0)
    this.recBuffers.push(buffer);
  
  recBuffers = recBuffersAux;
  self.postMessage({ command: "console", data: "Tamaño en buffers: " + recBuffers.length});
}

function finish() {
  if (recBuffers) {
    cutAudio();
    postProgress(0);
    encoder = new OggVorbisEncoder(sampleRate, numChannels, options.ogg.quality);
    var timeout = Date.now() + options.progressInterval;
    while (recBuffers.length > 0) {
      encoder.encode(recBuffers.shift());
      var now = Date.now();
      if (now > timeout) {
        postProgress((bufferCount - recBuffers.length) / bufferCount);
        timeout = now + options.progressInterval;
      }
    }
    postProgress(1);
  }
  self.postMessage({
    command: "complete",
    blob: encoder.finish(options.ogg.mimeType)
  });
  cleanup();
};

function cleanup() {
  encoder = recBuffers = undefined;
  bufferCount = 0;
}

self.onmessage = function(event) {
  var data = event.data;
  switch (data.command) {
    case "init":    init(data);                 break;
    case "options": setOptions(data.options);   break;
    case "start":   start(data.bufferSize);     break;
    case "record":  record(data.buffer);        break;
    case "finish":  finish();                   break;
    case "cancel":  cleanup();
  }
};

self.postMessage({ command: "loaded" });