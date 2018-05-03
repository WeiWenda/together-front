import {LOAD_ACTIVITY, REFRESH_ACTIVITYLIST, PART_ACTIVITY} from '../actions/types';
import {server} from '../components/config/urls';
import {store} from '../components/VtogetherHome';
import {loadActivityList,receiveToast} from '../actions/creators';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
};

export async function getActivityList(param, cur_user) {
  let response = await fetch(`${server}user/getActivityList`, {
    method: 'POST',
    headers: headers,
    body: `type=${param}&user_id=${cur_user}`
  });
  let responseJson = await response.json();
  return responseJson.data;
}

const partActivity = (obj) => {
  return fetch(`${server}user/signUp`, {
    method: 'POST',
    headers: headers,
    body: `user_id=${obj.uid}&activity_id=${obj.aid}`
  }).then((response) => response.json());
};
const activityListReducer = (state, action, cur_user) => {
  switch (action.type) {
    case LOAD_ACTIVITY:
      state[action.data.domain] = action.data.data;
      break;
    case REFRESH_ACTIVITYLIST:
      getActivityList('enterable', cur_user).then(data => {
        store.dispatch(loadActivityList('enterableActivities', data));
      });
      getActivityList('preparing', cur_user).then(data => {
        store.dispatch(loadActivityList('preparingActivities', data));
      });
      getActivityList('going', cur_user).then(data => {
        store.dispatch(loadActivityList('goingActivities', data));
      });
      getActivityList('done', cur_user).then(data => {
        store.dispatch(loadActivityList('doneActivities', data));
      });
      break;
    case PART_ACTIVITY:
      partActivity(action.data).then(data => {
        store.dispatch(receiveToast(data.data));
        getActivityList('preparing', cur_user).then(data => {
          store.dispatch(loadActivityList('preparingActivities', data));
        });
        getActivityList('enterable', cur_user).then(data => {
          store.dispatch(loadActivityList('enterableActivities', data));
        });
      });
      break;
  }
  return state;
};
export default activityListReducer;