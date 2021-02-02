import React from 'react';
import Header from '../../components/header/header';
import { Link } from 'react-router-dom';
import { Routes } from '../../constants';
import { Typography } from 'antd';
import './start.scss';
const { Text } = Typography;


const StartPage = () => {

   return (<>
    <Header />
    <main className="page-main start-page">
      <div className="start-page__wrapper wrapper">
        <h2 className="start-page__title" >Hi, here is MetaPotato App, educational social network</h2>
        <span>Please <Text strong underline><Link to={Routes.AUTH}>login</Link></Text> to continue</span>
      </div>
      
    </main>
  </>);
}

export default StartPage;