const {RECEIVE_TOAST} = require('../lib/loginConf/constants').default;

const toastReducer = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_TOAST:
      state = action.data;
      break;
  }
  return state;
};
export default toastReducer;