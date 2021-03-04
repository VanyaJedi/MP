import { RootState } from '../reducer';
import NameSpace from '../name-spaces';

const NAME_SPACE = NameSpace.FETCHING;

export const getInitialFetchingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isInitFetching;
};

export const getChatUsersFetchingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isChatUserFetching;
};

export const getMessagesFetchingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isMessagesFetching;
};

export const getAuthFetchingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isAuthFetching;
};

export const getProfileFetchingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isProfileFetching;
};

export const getAvatarLoadingStatus = (state: RootState): boolean => {
  return state[NAME_SPACE].isAvatarLoading;
};
