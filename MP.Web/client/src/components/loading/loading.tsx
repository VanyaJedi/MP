import React from 'react';
import { Spin } from 'antd';
import './loading.scss';
const Loading: React.FunctionComponent = () => { 
  
  return (
    <div className="loading">
      <Spin tip="Loading..."/>
    </div>
    
  );

};

export default Loading;