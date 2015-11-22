(function(window) {

  var extend = function() {
    var target = arguments[0],
        sources = [].slice.call(arguments, 1);
    for (var i = 0; i < sources.length; ++i) {
      var src = sources[i];
      for (key in src) {
        var val = src[key];
        target[key] = typeof val === "object"
          ? extend(typeof target[key] === "object" ? target[key] : {}, val)
        : val;
      }
    }
    return target;
  };

  var WORKER = { ogg: "oggEncoder.js" };
  var configs = {
    workerDir: "/js/",
    numChannels: 1,
    encoding: "ogg",
    sampleRate: 44100,

    options: {
      timeLimit: 180,           // recording time limit (sec)
      encodeAfterRecord: true, // process encoding after recording
      progressInterval: 1000,   // encoding progress report interval (millisec)
      bufferSize: 4096,
      ogg: {
        mimeType: "audio/ogg",
        quality: 1
      }
    }
  };

  var pronuntiaRecorder = function (source, config) {
    extend(this, configs, config || {});
    this.context = source.context;
    if (this.context.createScriptProcessor == null)
      this.context.createScriptProcessor = this.context.createJavaScriptNode;
    this.input = this.context.createGain();
    source.connect(this.input);
    this.buffer = [];
    this.initWorker();
  };
  
  extend(pronuntiaRecorder.prototype, {
    isRecording: function() { return this.processor != null; },
    
    startRecording: function() {
      if (this.isRecording()) 
        this.error("startRecording: recording is running");
      else {
        var numChannels = this.numChannels,
            buffer = this.buffer,
            worker = this.worker;
        
        this.processor = this.context.createScriptProcessor(this.options.bufferSize, this.numChannels, this.numChannels);
        this.input.connect(this.processor);
        this.processor.connect(this.context.destination);
        this.processor.onaudioprocess = function (event) {
          for (var ch = 0; ch < numChannels; ++ch)
            buffer[ch] = event.inputBuffer.getChannelData(ch);
            worker.postMessage({ command: "record", buffer: buffer });
        };
        this.worker.postMessage({
          command: "start",
          bufferSize: this.processor.bufferSize
        });
        this.startTime = Date.now();
      }
    },
    
    recordingTime: function() {
      return this.isRecording() ? (Date.now() - this.startTime) * 0.001 : null;
    },
    
    cancelRecording: function() {
      if (this.isRecording()) {
        this.input.disconnect();
        this.processor.disconnect();
        delete this.processor;
        this.worker.postMessage({ command: "cancel" });
      } else
        this.error("cancelRecording: no recording is running");
    },
    
    stopRecording: function() {
      if (this.isRecording()) {
        this.input.disconnect();
        this.processor.disconnect();
        delete this.processor;
        this.worker.postMessage({ command: "finish" });
      } else
        this.error("finishRecording: no recording is running");
    },
    
    cancelEncoding: function() {
      if (this.options.encodeAfterRecord) {
        if (this.isRecording())
          this.error("cancelEncoding: recording is not finished");
        else {
          this.onEncodingCanceled(this);
          this.initWorker();
        }
      }
      else
        this.error("cancelEncoding: invalid method call");
    },
    
    
    initWorker: function() {
      if (this.worker != null)
        this.worker.terminate();
      this.onEncoderLoading(this, this.encoding);
      this.worker = new Worker(this.workerDir + WORKER[this.encoding]);
      var _this = this;
      this.worker.onmessage = function(event) {
        var data = event.data;
        switch (data.command) {
          case "loaded":
            _this.onEncoderLoaded(_this, _this.encoding);
            break;
          case "timeout":
            _this.onTimeout(_this);
            break;
          case "progress":
            _this.onEncodingProgress(_this, data.progress);
            break;
          case "complete":
            _this.onComplete(_this, data.blob);
            break;
          case "error":
            _this.onError(_this, data.message);
            break;
          case "console":
            _this.onConsole(_this, data.data);
            break;
        }
      };
      
      this.worker.postMessage({
        command: "init",
        config: {
          sampleRate: this.sampleRate,
          numChannels: this.numChannels
        },
        options: this.options
      });
    },
    
    // event handlers
    onEncoderLoading: function(recorder, encoding) {},
    onEncoderLoaded: function(recorder, encoding) {},
    onTimeout: function(recorder) { recorder.stopRecording(); },
    onEncodingProgress: function (recorder, progress) {},
    onEncodingCanceled: function(recorder) {},
    onComplete: function(recorder, blob) {},
    onError: function(recorder, message) { console.log(message); },
    onConsole: function(recorder, message) {console.log(message);}
  });

  window.pronuntiaRecorder = pronuntiaRecorder;

}) (window);
