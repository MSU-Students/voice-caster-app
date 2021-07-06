import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

class ServerConnectionService {
  async connect() {
    this.socket = new SockJS("http://localhost:8090/gs-guide-websocket");
    this.stompClient = Stomp.over(this.socket);
    await this.stompClient.connect(
      {},
      frame => {
        console.log(frame);
        this.stompClient.subscribe("/topic/greetings", tick => {
          console.log(tick);
        });
      },
      error => {
        console.log(error);
        console.log("Cannot connect to server..");
      }
    );
  }
  async send(message) {
    console.log("Send message: " + message);
    if (this.stompClient && this.stompClient.connected) {
      const msg = { name: message };
      console.log(JSON.stringify(msg));
      await this.stompClient.send("/app/hello", JSON.stringify(msg), {});
    } else{
      console.log('Not connected to server! ');
    }
  }
  async disconnect() {
    if (this.stompClient) {
      await this.stompClient.disconnect();
    }
  }
  async tickleConnection() {
    await this.isConnected ? this.disconnect() : this.connect();
  }
}

let serverConnectionService = new ServerConnectionService();

export default serverConnectionService;
