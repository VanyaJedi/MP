import * as signalR from '@microsoft/signalr';
import axios from "axios";
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/chat", {
      accessTokenFactory: async () => {
        const tokenResponse = await axios.get('/user/jwt/');
        const token = tokenResponse.data;
        return token;
      }
    })
    .build();

/*async function start() {
  try {
      await hubConnection.start();
      console.log("SignalR Connected.");
  } catch (err) {
      console.log(err);
      setTimeout(start, 5000);
  }
};

hubConnection.onclose(start);

start();*/

export default hubConnection;
