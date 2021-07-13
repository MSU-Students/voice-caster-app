import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
class ServerConnectionService {
  async connect() {
    return new Promise((resolve, reject) => {
      let socket = null;
      const live = "https://voice-serve.herokuapp.com/ws";
      const ip = "192.168.134.149";
      const port = "9000";
      const dev = `http://${ip}:${port}/ws`; 
      this.socket = new SockJS(dev);
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        frame => {
          resolve(frame);
          this.stompClient.subscribe("/topic/announcements", tick => {
            console.log(tick);
          });
        },
        error => {
          resolve(error);
          console.log(error);
          console.log("Cannot connect to server..");
        }
      );
    });
  }
  async send(val) {
    const msg = { name: val };
    if (this.stompClient) {
      const res = await this.stompClient.send(
        "/app/information",
        JSON.stringify(msg),
        {}
      );
      console.log("hello", res);
    }
  }
  async disconnect() {
    if (this.stompClient) {
      await this.stompClient.disconnect();
    }
  }
  async tickleConnection() {
    (await this.isConnected) ? this.disconnect() : this.connect();
  }
}

let serverConnectionService = new ServerConnectionService();

export default serverConnectionService;
