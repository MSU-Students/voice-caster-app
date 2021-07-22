class AudioStreamingService {
  // async start(callback) {
  //   console.log("starting...");
  //   await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  //     this.mediaRecorder = new MediaRecorder(stream);
  //     const duration = 3000;
  //     this.mediaRecorder.start(duration);
  //     const audioChunks = [];

  //     this.mediaRecorder.addEventListener("dataavailable", event => {
  //       const audioBlob = new Blob([event.data]);
  //       console.log('omair:', audioBlob);
  //       var reader = new FileReader();
  //       reader.readAsDataURL(audioBlob);
  //       reader.onloadend = function() {
  //         console.log(reader);
  //         callback(reader.result);
  //       };
  //     });
  //   });
  // }
  async stop() {
    const stop = await this.mediaRecorder.stop();
    console.log("stop: ", stop);
  }
  blobs = [];
  mediaRecorder = undefined;
  async start2(callback) {
    this.blobs =[];
    const self = this;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    var mediaRecorder = new MediaRecorder(stream);
    self.mediaRecorder = mediaRecorder;
    const duration = 1000;
    mediaRecorder.start(duration);
    mediaRecorder.ondataavailable = function(e) {
        var fileReader = new FileReader();
        fileReader.onload = function() {
          //console.log('blob: ', fileReader);
          callback(fileReader.result);
        };
        fileReader.readAsDataURL(e.data);
    }
  }

 stop2() {
    //start
    const self = this;
    self.mediaRecorder.stop();
    var mediaSource = new MediaSource();
    let sourceBuffer = undefined;
    var replay = new Audio();
    replay.src = window.URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', async function(e) {
        sourceBuffer = mediaSource.addSourceBuffer('audio/webm\;codecs=opus');

        for (let index = 0; index < self.blobs.length; index++) {
          const blob = self.blobs[index];
          if (sourceBuffer && sourceBuffer.updating) {
            await (new Promise((resolve) => {
              sourceBuffer.onupdateend = resolve;
            }))
          }
          
          const head = 'data:audio/webm;codecs=opus;base64,';
          sourceBuffer.appendBuffer(Buffer.from(blob.substr(head.length), 'base64'));
        }
        replay.play();
        console.log('playing...........', self.blobs.length)
    });
    //send multiple 
    
  }
  
}

let audioStreamingService = new AudioStreamingService();

export default audioStreamingService;
