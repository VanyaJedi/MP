import { SettingOutlined, LogoutOutlined, MessageFilled, HomeFilled } from '@ant-design/icons';

export const mediaQueries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1439px)',
  desktop: '(min-width: 1440px)'
};

export const LOG_OUT = 'Log out';

export const dropMenuItems = [
  {   
    id: 1,
    name: 'Settings', 
    icon: SettingOutlined
  }/*,
  {
    id: 2,
    name: LOG_OUT, 
    icon: LogoutOutlined,
  }*/
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