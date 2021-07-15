class AudioStreamingService {
  async start(callback) {
    console.log("starting...");
    await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      const duration = 1000;
      this.mediaRecorder.start(duration);
      const audioChunks = [];

      this.mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        const audioBlob = new Blob(audioChunks);
        var reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = function() {
          console.log("here: ", reader);
          // callback(JSON.stringify({
          //   data: reader.result,
          //   time: (new Date()).getDate(),
          //   duration: duration
          // }));
          callback(reader.result);
        };
      });

      // this.mediaRecorder.addEventListener("stop", () => {
      // const audioURL = URL.createObjectURL(audioBlob);
      // const audio = new Audio(audioURL);
      // audio.play();
      //audioBlob.text().then(callback)
      // });
    });
  }
  async stop() {
    const stop = await this.mediaRecorder.stop();
    console.log("stop: ", stop);
  }
}

let audioStreamingService = new AudioStreamingService();

export default audioStreamingService;
