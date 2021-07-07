import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

class ServerConnectionService {
  async connect() {
    this.socket = new SockJS("http://192.168.1.244:9000/ws");
    this.stompClient = Stomp.over(this.socket);
    await this.stompClient.connect(
      {},
      frame => {
        console.log(frame);
        this.stompClient.subscribe("/topic/announcements", tick => {
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
      await this.stompClient.send("/app/information", JSON.stringify(msg), {});
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
