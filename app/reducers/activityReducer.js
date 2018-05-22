import {ADD_ACTIVITY,SAVE_ACTIVITY,PART_ACTIVITY}from '../actions/types';
import {server} from '../lib/urls';
import {transformer} from '../lib/helpFunctions';
import {store} from '../VtogetherHome';
import Activity from '../data/Activity';
import {refreshActivityList} from '../actions/creators';

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
const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ACTIVITY:
      state.set(action.data.domain,action.data.content);
      break;
    case SAVE_ACTIVITY:
      state.set('closeTime',transformer(state.startTime,state.prepareTime));
      state.set('endTime',transformer(state.startTime,state.duration));
      state.set('name',action.data.name);
      state.set('introduction',action.data.introduction);
      delete state.prepareTime;
      delete state.duration;
      console.log(JSON.stringify(state));
      saveActivity(state).then(text=>store.dispatch((refreshActivityList())));
      state = new Activity('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn',
        "默认", 1);
      break;
  }
  return state;
};
export default activityReducer;