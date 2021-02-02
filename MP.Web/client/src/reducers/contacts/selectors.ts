import { State, User } from '../../types/interfaces'
import NameSpace from '../name-spaces';

const NAME_SPACE = NameSpace.USER;

export const getUser = (state: State): User | null => {
  return state[NAME_SPACE].user;
};

