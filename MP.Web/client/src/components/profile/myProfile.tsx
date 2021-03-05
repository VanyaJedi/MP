import React, { useState } from 'react';
import { Upload, message, Button, Modal } from 'antd';
import { LoadingOutlined, PictureOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Operation as UserOperation } from '../../reducers/user/user';
import { getAvatarLoadingStatus } from '../../reducers/fetching/selectors';
import { User } from '../../types/interfaces';
import CropPopup from '../crop/crop';
import cutePotato from '../../assets/images/cute_potato.png';
import { AppDispatch } from '../../reducers/store';
import { Routes } from '../../constants';
import './profile.scss';


interface Props {
  user: User;
}

const getBase64 = (file: any, cb: any) => {
  const  reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
  return reader.result;
}

const MyProfile: React.FunctionComponent<Props> = ({ user }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const isAvatarLoading = useSelector(getAvatarLoadingStatus);
  
  const [img, setImg] = useState<string>();
  const [finalImg, setFinalImg] = useState<string>();
  
  const  beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    if (isJpgOrPng && isLt2M) {
      getBase64(file, setImg);
    }
    return false;
  }

  const modalFooter = (
    <Button 
      type="primary" 
      htmlType="submit" 
      loading={isAvatarLoading}
      disabled={!finalImg}
      onClick={() => {
        if (finalImg) {
          dispatch(UserOperation.setPhoto(finalImg))
            .then(() => {
              setImg('');
            })
        }
      }}
    >
      Set picture
    </Button>
  );


  const uploadBlock = (
    <div className="profile__upload-block">
      {user && user.avatar ? <img src={user.avatar} alt="avatar" /> : <img src={cutePotato} alt="avatar" />}
      <Button 
        shape="circle" 
        type="primary" 
        className="btn btn--blue profile__upload-btn" 
        icon={isAvatarLoading ? 
          <LoadingOutlined className="profile__icon" size={32} /> : 
          <PictureOutlined className="profile__icon" size={32} />}
      />
    </div>
  );
  
  return (
    <>
      <section className="profile profile--my">
        <div className="profile__wrapper">
          <div className="profile__user">
            <Upload
              className="profile__avatar-block"
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {uploadBlock}
            </Upload>
            <div className="profile__user-block">
              <h1 className="profile__title">My Profile</h1>
              <ul className="profile__user-info">
                <li>
                  <MailOutlined /> {user && user.email}
                </li>
              </ul>  
            </div>
            
          </div>
        </div>
        <ul className="profile__actions"> 
          <li>
            <Link to={Routes.MESSENGER}>
              <MessageOutlined /> Chats
            </Link>
          </li>
        </ul>
      </section>
       <Modal
        width={300}
        visible={!!img}
        okText="Set picture"
        onCancel={() => setImg('')}
        footer={modalFooter}
       >
        {img && <CropPopup img={img} setFinalImg={setFinalImg} />}
      </Modal> 
    </>
  );
};

export default MyProfile;