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
  PROFILE = '/profile'
}

export const navigationItems = [
  {
    id: 1,
    name: 'Home',
    icon: HomeFilled,
    route: Routes.ROOT,
    color: 'pink'
  },
  {
    id: 2,
    name: 'Messenger',
    icon: MessageFilled,
    route: Routes.MESSENGER,
    color: 'blue'
  },
]

export enum MessageStatus {
  SENDING = 'sending',
  SUCCESS = 'success',
  FAIL = 'fail'
}