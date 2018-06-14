import publicData from './habitReducer';
import newClubData from './clubReducer';
import toast from './toastReducer';
import newActivityData from './activityReducer';
import {combineReducers} from "redux";
import auth from './auth/authReducer'
import device from './device/deviceReducer'
import global from './global/globalReducer'

const rootReducer = combineReducers({
  auth,
  toast,
  newClubData,
  publicData,
  newActivityData,
  device,
  global
})

export default rootReducer;
