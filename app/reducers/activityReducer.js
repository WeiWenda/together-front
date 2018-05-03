import {ADD_ACTIVITY,SAVE_ACTIVITY,PART_ACTIVITY}from '../actions/types';
import {server} from '../components/config/urls';
import {transformer} from '../components/functions/helpFunctions';
import {store} from '../components/VtogetherHome';
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

const activityReducer = (state, action) => {
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