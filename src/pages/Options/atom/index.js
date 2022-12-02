import { atom } from 'recoil';

export const keywordState = atom({
  key: 'keywordState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
