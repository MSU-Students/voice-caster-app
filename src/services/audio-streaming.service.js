class AudioStreamingService {
    async start() {
        return new Promise(async resolve => {
            console.log('starting...');
          await navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
              const mediaRecorder = new MediaRecorder(stream);
              mediaRecorder.start();
              const audioChunks = [];   
    
              mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
              });
    
              mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
    
                // const audioURL = URL.createObjectURL(audioBlob);
                // const audio = new Audio(audioURL);
                // audio.play();
    
                var reader = new FileReader();
                var base64data;
                reader.readAsDataURL(audioBlob);
                reader.onloadend = function() {
                  base64data = reader.result;
                  resolve(base64data);
                };
              });
              setTimeout(() => {
                mediaRecorder.stop();
              }, 3000);
            });
        });
      }
}

let audioStreamingService = new AudioStreamingService();

export default audioStreamingService;