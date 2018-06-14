const {ADD_ACTIVITY,
  REMOVE_ACTIVITY,
  SAVE_ACTIVITY} = require('../lib/loginConf/constants').default;
import {server} from '../lib/urls';
import {transformer} from '../lib/helpFunctions';
import {store} from '../VtogetherHome';
import Activity from '../data/Activity';
import {refreshActivityList} from './global/globalActions';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const saveActivity=(state)=>{
  return fetch(`${server}activity/add`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(state)
  })
    .then((response) => response.text())
};
export const initialState = new Activity('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn',
  "默认", 1);

function removeActivity(data) {
  return fetch(`${server}/activity/delete`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
    .then((response) => response.text())
}

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ACTIVITY:
      return state.set(action.data.domain,action.data.content);
    case SAVE_ACTIVITY:
      state.set('closeTime',transformer(state.startTime,state.prepareTime));
      state.set('endTime',transformer(state.startTime,state.duration));
      state.set('name',action.data.name);
      state.set('introduction',action.data.introduction);
      Object.assign(state,action.data)
      delete state.prepareTime;
      delete state.duration;
      console.log(JSON.stringify(state));
      saveActivity(state).then(text=>store.dispatch((refreshActivityList(action.data.userId))));
      return new Activity('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn',
        "默认", 1);
    case REMOVE_ACTIVITY:
      removeActivity(action.data).then(text=>store.dispatch(refreshActivityList(action.data.userId)));
      break;
  }
  return state;
};
export default activityReducer;