class AudioStreamingService {
  async start(callback) {
    console.log("starting...");
    await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      const duration = 5000;
      this.mediaRecorder.start(duration);
      const audioChunks = [];

      this.mediaRecorder.addEventListener("dataavailable", event => {
        const audioBlob = new Blob([event.data]);
        var reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = function() {
          callback(reader.result);
        };
      });
    });
  }
  async stop() {
    const stop = await this.mediaRecorder.stop();
    console.log("stop: ", stop);
  }
}

let audioStreamingService = new AudioStreamingService();

export default audioStreamingService;
