import {RECEIVE_TOAST} from "../actions/types";

import {server} from '../components/config/urls';
import {store} from '../components/VtogetherHome';
import Club from '../data/Club';
import {refreshClubList} from '../actions/creators';

const toastReducer = (state, action) => {
  switch (action.type) {
    case RECEIVE_TOAST:
      state = action.data;
      break;
  }
  return state;
};
export default toastReducer;