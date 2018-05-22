import {
  EDIT_USER, LOAD_ACTIVITY, LOAD_CLUBLIST, PART_ACTIVITY, REFRESH_ACTIVITYLIST, REFRESH_CLUBLIST,
  UPLOAD_IMAGE
} from '../actions/types';
import {store } from '../VtogetherHome';
import {server,qiniu,imageServer} from '../lib/urls';
import {loadActivityList, loadClubList, receiveToast} from "../actions/creators";
export const JsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
export const UrlHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
};
export async function getActivityList(param, cur_user) {
  let response = await fetch(`${server}user/getActivityList`, {
    method: 'POST',
    headers: UrlHeaders,
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
export async function getClubList(param, cur_user){
  let response =await fetch(`${server}user/getClubList`, {
    method: 'POST',
    headers: UrlHeaders,
    body: `type=${param}&user_id=${cur_user}`
  });
  let responseJson =await response.json();
  return responseJson.data;
}
export const uploadImage = (user_id,fileuri,callback) => {
  let formData = new FormData();
  let file = {uri: fileuri, type: 'image/jpeg'};

  formData.append("file", file);

  fetch(`${server}user/upload?user_id=${user_id}`)
    .then((response) => response.text())
    .then((key) => {
      formData.append("token", key);
      fetch(qiniu, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }).then((response) => response.json()).then(
        text =>{
          callback(`${imageServer}${text.key}`);
        }
      )
    });
};
const updateUser = (state, action) => {
  if(state[action.data.domain]=== action.data.content) return;
  state[action.data.domain] = action.data.content;
  return fetch(`${server}user/update`, {
    method: 'POST',
    headers: JsonHeaders,
    body: JSON.stringify({
      user_id: state.user_id,
      domain: action.data.domain,
      value: action.data.content,
    })
  })
    .then((response) => response.text())
    .then(text => console.log(text));
};
export const initialState = {
    memberClubs: [],
    chiefClubs: [],
    goingActivities:[],
    doneActivities:[],
    preparingActivities:[],
    enterableActivities:[],
    user_id: 1,
    name: "炫Star", signature: "暂无",
    sex: 0, birthday: "1995-04-14T17:33:26",
    labels: "程序猿", habits: "轮滑,游泳",
    address: '西安',
};
const userReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case LOAD_ACTIVITY:
      state[action.data.domain] = action.data.data;
      break;
    case REFRESH_ACTIVITYLIST:
      getActivityList('enterable', state.user_id).then(data => {
        store.dispatch(loadActivityList('enterableActivities', data));
      });
      getActivityList('preparing', state.user_id).then(data => {
        store.dispatch(loadActivityList('preparingActivities', data));
      });
      getActivityList('going', state.user_id).then(data => {
        store.dispatch(loadActivityList('goingActivities', data));
      });
      getActivityList('done', state.user_id).then(data => {
        store.dispatch(loadActivityList('doneActivities', data));
      });
      break;
    case PART_ACTIVITY:
      partActivity(action.data).then(data => {
        store.dispatch(receiveToast(data.data));
        getActivityList('preparing', state.user_id).then(data => {
          store.dispatch(loadActivityList('preparingActivities', data));
        });
        getActivityList('enterable', state.user_id).then(data => {
          store.dispatch(loadActivityList('enterableActivities', data));
        });
      });
      break;
    case LOAD_CLUBLIST:
      state[action.data.domain] = action.data.data;
      break;
    case REFRESH_CLUBLIST:
      getClubList('member',state.user_id).then(data => {
        store.dispatch(loadClubList('memberClubs',data));
      });
      getClubList('chief',state.user_id).then(data => {
        store.dispatch(loadClubList('chiefClubs',data));
      });
    case EDIT_USER:
      updateUser(state, action);
      break;
    case UPLOAD_IMAGE:
      uploadImage(state.user_id,action.data.uri,(fileUrl)=>{
        store.dispatch(action.data.callback(action.data.domain,fileUrl));
      });
      break;
  }
  return {...state};
};
export default userReducer;