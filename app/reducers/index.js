import userReducer from './userReducer';
import habitReducer from './habitReducer';
import clubReducer from './clubReducer';
import toastReducer from './toastReducer';
import clubListReducer from './clubListReducer';
import activityReducer from './activityReducer';
import activityListReducer from './activityListReducer';
import {server} from '../components/config/urls';
import Club from "../data/Club";
import Activity from '../data/Activity';
const fetchData = (param) => {
  const url = `${server}${param === 'labels' ? "user/" : ""}${param}`;
  return fetch(url)
    .then(text => text.json())
};
const userProfile = () => {
  return {
    user_id: 1,
    name: "炫Star", signature: "暂无",
    sex: 0, birthday: "1995-04-14T17:33:26",
    labels: "程序猿", habits: "轮滑,游泳",
    address: '西安',
  };
};
const initialState = () => {
  let result = {
    userdata: userProfile(),
    publicData: {
      habits: [],
      labels: [],
    },
    newClubData: new Club('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn', "默认", 1),
    newActivityData: new Activity('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn',
      "默认", 1),
    myClubList: {
      memberClubs: [],
      chiefClubs: [],
    },
    myActivityList:{
      goingActivities:[],
      doneActivities:[],
      preparingActivities:[],
      enterableActivities:[],
    }
  };
  fetchData('habits').then(obj => result.publicData.habits = obj.data);
  fetchData('labels').then(obj => result.publicData.labels = obj.data);
  return result;

};
export const reducer = (state = initialState(), action) => {
  console.log(state,action);
  return {
    toast : toastReducer(state.toast,action),
    userdata: userReducer(state.userdata, action),
    publicData: habitReducer(state.publicData, action),
    newClubData: clubReducer(state.newClubData, action),
    newActivityData: activityReducer(state.newActivityData, action),
    myClubList: clubListReducer(state.myClubList, action, state.userdata.user_id),
    myActivityList:activityListReducer(state.myActivityList,action,state.userdata.user_id),
  };
};
