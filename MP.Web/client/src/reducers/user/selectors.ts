import { User } from '../../types/interfaces'
import { RootState } from '../reducer';
import NameSpace from '../name-spaces';

const NAME_SPACE = NameSpace.USER;

export const getUser = (state: RootState): User | null => {
  return state[NAME_SPACE].user;
};

