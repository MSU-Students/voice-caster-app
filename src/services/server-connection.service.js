import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

let stompClient = null;
let msg = undefined;

class ServerConnectionService {
  async connect() {
    return new Promise((resolve, reject) => {
      let socket = new SockJS("http://192.168.43.140:9000/ws");
      stompClient = Stomp.over(socket);
      stompClient.connect(
        {},
        frame => {
          resolve(frame.command);
          stompClient.subscribe("/topic/announcements", tick => {
            console.log(tick);
          });
        },
        error => {
          reject(error);
          console.log(error);
          console.log("Cannot connect to server..");
        }
      );
    });
  }
  async send(val) {
    msg = { name: val };
    if (stompClient) {
      const res = await stompClient.send(
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
