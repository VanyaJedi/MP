import React from 'react';
import Header from '../../components/header/header';
import { Link } from 'react-router-dom';
import { Routes } from '../../constants';
import { Typography } from 'antd';

import './not-found.scss';

const { Text } = Typography;

const NotFoundPage = () => {

   return (<>
    <Header />
    <main className="page-main not-found">
      <h1>Page not found</h1>
      <Text strong underline><Link to={Routes.ROOT}>Link to root page</Link></Text>
    </main>
  </>);
}

export default NotFoundPage;