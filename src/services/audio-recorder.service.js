class AudioRecorderService {
    async recordAudio() {
      await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
          console.log("recording: ", audioChunks);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioURL = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioURL);
          audio.play();
        });

        setTimeout(() => {
          mediaRecorder.stop();
        }, 3000);
      });
    }

}

let audioRecorderService = new AudioRecorderService();

export default audioRecorderService;