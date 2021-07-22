import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import officeDBService from "../services/office-db.service.js";
class ServerConnectionService {
  async connect(ip, port) {
    return new Promise((resolve, reject) => {
      let socket = null;
      const live = "https://voice-serve.herokuapp.com/ws";
      console.log('IP:', ip, 'Port: ', port);
      const dev = `http://${ip}:${port}/ws`; 
      this.socket = new SockJS(dev);
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = () => {};
      this.stompClient.connect(
        {},
        frame => {
          resolve(frame);
          this.stompClient.subscribe("/topic/announcements", tick => {
           
          });
          this.stompClient.subscribe("/topic/register", tick => {
            let clients = JSON.parse(tick.body);
           
            officeDBService.addOffice(clients);
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
      await this.stompClient.send(
        "/app/information",
        JSON.stringify(msg),
        {}
      );
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
  isItemExist(itemName) {
    if (localStorage.getItem(itemName) !== null) {
      console.log(`Server IP found!`);
    } else {
      console.log(`Server IP not found!`);
      let ip = JSON.stringify("");
      this.addServerIP("server_ip", ip);
    }
  }
  async addServerIP(key, val) {
    let ip = JSON.stringify(val);
    return localStorage.setItem(key, ip);
  }
  async getIpAddress() {
    let ip = JSON.parse(localStorage.getItem("server_ip"));
    return await ip;
  }
}

let serverConnectionService = new ServerConnectionService();

export default serverConnectionService;
