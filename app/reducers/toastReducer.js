import {RECEIVE_TOAST} from "../actions/types";

const toastReducer = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_TOAST:
      state = action.data;
      break;
  }
  return state;
};
export default toastReducer;