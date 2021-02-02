import React from 'react';
import Header from '../../components/header/header';
import Chats from '../../components/chats/chats';
import Messages from '../../components/messages/messages';
import './messenger.scss';

const MessengerPage = () => {

   return (<>
    <Header />
    <main className="page-main messenger">
      <Chats />
      <Messages />
    </main>
  </>);
}

export default MessengerPage;