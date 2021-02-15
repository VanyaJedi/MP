import { RootState } from '../reducer';
import NameSpace from '../name-spaces';

const NAME_SPACE = NameSpace.APP;

export const getHubConnectionState = (state: RootState): boolean => {
  return state[NAME_SPACE].isHubConnected;
};

export const getProfileMenuState = (state: RootState): boolean => {
  return state[NAME_SPACE].isProfileMenuOpen;
};

export const getMobileMessengerState = (state: RootState): boolean => {
  return state[NAME_SPACE].isMobileMessagesAreaOpen;
};

export const getErrorMessage = (state: RootState): string | null => {
  return state[NAME_SPACE].errorMessage;
};

export const getSuccessMessage = (state: RootState): string | null => {
  return state[NAME_SPACE].successMessage;
};
