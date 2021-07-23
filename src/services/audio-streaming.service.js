class AudioStreamingService {

  mediaRecorder = undefined;
  async start2(callback) {
    const self = this;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    var mediaRecorder = new MediaRecorder(stream);
    self.mediaRecorder = mediaRecorder;
    const duration = 500;
    mediaRecorder.start(duration);
    mediaRecorder.ondataavailable = function(e) {
        var fileReader = new FileReader();
        fileReader.onload = function() {
          callback(fileReader.result);
        };
        fileReader.readAsDataURL(e.data);
    }
  }

  async stop() {
    const self = this;
    await self.mediaRecorder.stop();
    console.log("stop ");
  }
  
  async pause() {
    const self = this;
    if(this.mediaRecorder.state === "recording") {
      await self.mediaRecorder.pause();
      console.log('paused.');
      // recording paused
    }
  }

  async resume() {
    const self = this;
    if(self.mediaRecorder.state === "paused") {
      await self.mediaRecorder.resume();
      console.log('resume recording..');
      // recording paused
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
