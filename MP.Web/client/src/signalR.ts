import * as signalR from '@microsoft/signalr';
import axios from "axios";


const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("/chat", {
    accessTokenFactory: async () => {
      const tokenResponse = await axios.get('/user/jwt/');
      const token = tokenResponse.data;
      console.log(token);
      return token;
    }
  })
  .build();


 const  start = async ()=> {
  try {
    await hubConnection.start();
    console.log("SignalR Connected.");
  } catch (err) {
      console.log(err);
      setTimeout(start, 5000);
  }
}

 const stop = async () => {
  await hubConnection.stop();
}

export { start, stop} ;

export default hubConnection;




/*

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/chat", {
      accessTokenFactory: async () => {
        const tokenResponse = await axios.get('/user/jwt/');
        const token = tokenResponse.data;
        return token;
      }
    })
    .build();
  
export const start = async () => {
  try {
      await hubConnection.start();
      console.log("SignalR Connected.");
  } catch (err) {
      console.log(err);
      setTimeout(start, 5000);
  }
};

hubConnection.onclose(start);

export default hubConnection;*/
