import { SettingOutlined, MessageFilled, HomeFilled } from '@ant-design/icons';

export const mediaQueries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1439px)',
  desktop: '(min-width: 1440px)'
};

export const dropMenuItems = [
  {   
    id: 1,
    name: 'Settings', 
    icon: SettingOutlined
  }
];

export enum Routes {
  ROOT = '/',
  AUTH = '/auth',
  MESSENGER = '/messenger',
}

export const navigationItems = [
  {
    id: 1,
    name: 'Home',
    icon: HomeFilled,
    route: Routes.ROOT
  },
  {
    id: 2,
    name: 'Messenger',
    icon: MessageFilled,
    route: Routes.MESSENGER
  },
]

export enum MessageStatus {
  SENDING = 'sending',
  SUCCESS = 'success',
  FAIL = 'fail'
}