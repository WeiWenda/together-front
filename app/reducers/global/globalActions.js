/**
 * # globalActions.js
 *
 * Actions that are global in nature
 */

'use strict'
import BackendFactory from "../../lib/loginConf/BackendFactory";
import {imageServer, wsServer} from "../../lib/urls";
import store from 'react-native-simple-store';
import {getDataFromLocalStore} from "../../lib/helpFunctions";

/**
 * ## Imports
 *
 * The actions supported
 */
const {
  SET_SESSION_TOKEN,
  SET_STORE,
  SET_STATE,
  GET_STATE,
  EDIT_USER,
  ADD_LABEL,
  ADD_CLUB,
  REMOVE_CLUB,
  SAVE_CLUB,
  NEW_CONNECT,
  UPDATE_CLUB,
  ADD_ACTIVITY,
  SAVE_ACTIVITY,
  REMOVE_ACTIVITY,
  LOAD_ACTIVITY,
  LOAD_CLUBLIST,
  RECEIVE_TOAST,
  LOAD_FRIEND,
  LOAD_WEBSOCKET,
  MERGE_SESSIONLIST,
  DELETE_SESSION,
  CLEARUNREAD_SESSIONLIST,
  ADD_SESSION
} = require('../../lib/loginConf/constants').default

/**
 * ## set the sessionToken
 *
 */
export function modifyUser(userId, domain, value) {
  return dispatch => {
    return BackendFactory().updateUser({
      user_id: userId,
      domain: domain,
      value: value,
    })
      .then((text) => {
        dispatch(modifyLocalUser(domain, value))
      })
  }
}

export function uploadImage(userId, fileuri, callback) {
  return dispatch => {
    return BackendFactory().uploadImage(userId, fileuri).then(text => {
      callback(`${imageServer}${text.json.key}`);
    })
  }
};
export const modifyLocalUser = (domain, content) => {
  return {type: EDIT_USER, data: {domain: domain, content: content}};
};
export const addLabel = (type, content) => {
  return {type: ADD_LABEL, data: {type: type, content: content}};
};
export const NewConnect = (conn) => {
  return {type: NEW_CONNECT, data: conn};
};
export const addClub = (domain, content) => {
  return {type: ADD_CLUB, data: {domain: domain, content: content}};
};
export const removeClub = (userId, clubId) => {
  return {type: REMOVE_CLUB, data: {clubId: clubId, userId: userId}};
};
export const saveClub = (userId) => {
  return {type: SAVE_CLUB, data: {userId: userId}};
};
export const updateClub = (userId, data) => {
  return {type: UPDATE_CLUB, data: Object.assign(data, {userId: userId})};
};
export const addActivity = (domain, content) => {
  return {type: ADD_ACTIVITY, data: {domain: domain, content: content}};
};
export const saveActivity = (data) => {
  return {type: SAVE_ACTIVITY, data: {...data}};
};
export const removeActivity = (uid, aid) => {
  return {type: REMOVE_ACTIVITY, data: {userId: uid, activityId: aid}};
};
export const refreshActivityList = (user_id) => {
  return dispatch => {
    BackendFactory().getActivityList('enterable', user_id).then(data => {
      dispatch(loadActivityList('enterableActivities', data));
    });
    BackendFactory().getActivityList('preparing', user_id).then(data => {
      dispatch(loadActivityList('preparingActivities', data));
    });
    BackendFactory().getActivityList('going', user_id).then(data => {
      dispatch(loadActivityList('goingActivities', data));
    });
    BackendFactory().getActivityList('done', user_id).then(data => {
      dispatch(loadActivityList('doneActivities', data));
    });
  }
};
export const loadActivityList = (domain, data) => {
  return {type: LOAD_ACTIVITY, data: {domain: domain, data: data}};
};
export const refreshFriendList = (user_id) => {
  return dispatch => {
    BackendFactory().getFriendList(user_id).then(data => {
      dispatch(loadFriendList(data));
    });
  }
};
export const loadFriendList = (data) => {
  return {type: LOAD_FRIEND, data: data}
};

export const refreshClubList = (user_id) => {
  return dispatch => {
    BackendFactory().getClubList('member', user_id).then(data => {
      dispatch(loadClubList('memberClubs', data));
    });
    BackendFactory().getClubList('chief', user_id).then(data => {
      dispatch(loadClubList('chiefClubs', data));
    });
  }
};

export const loadWebSocket = (webSocket) => {
  return {type: LOAD_WEBSOCKET, data: webSocket};
};

export const initialWebSocket = () => {
  return dispatch => {
    dispatch(loadWebSocket(new WebSocket(`${wsServer}`)))
  }
};

export const mergeSessionList = (data) => {
  return {type: MERGE_SESSIONLIST, data: data}
};
export const clearUnReadMessageCount = (key) => {
  return {type: CLEARUNREAD_SESSIONLIST, data: key}
};
// 删除会话记录
export const deleteSession = (key) => {
  return {type: DELETE_SESSION, data: key}
};
export const addSession = (key,content) =>{
  return {type: ADD_SESSION,data:{key:key,content:content}}
}
export const restoreDataFromLocalStore = () => {
  return dispatch => {
    getDataFromLocalStore().then(initArray=>
      dispatch(mergeSessionList(initArray))
    );
  }
};
export const loadClubList = (domain, data) => {
  return {type: LOAD_CLUBLIST, data: {domain: domain, data: data}};
};
export const partActivity = (uid, aid) => {
  return dispatch => {
    BackendFactory().partActivity(uid, aid).then(data => {
      dispatch(receiveToast(data));
      BackendFactory().getActivityList('preparing', uid).then(data => {
        dispatch(loadActivityList('preparingActivities', data));
      });
      BackendFactory().getActivityList('enterable', uid).then(data => {
        dispatch(loadActivityList('enterableActivities', data));
      });
    });
  }
};
export const receiveToast = (data) => {
  return {type: RECEIVE_TOAST, data: data};
};

export function setSessionToken(sessionToken) {
  return {
    type: SET_SESSION_TOKEN,
    payload: sessionToken
  }
}

/**
 * ## set the store
 *
 * this is the Redux store
 *
 * this is here to support Hot Loading
 *
 */
export function setStore(store) {
  return {
    type: SET_STORE,
    payload: store
  }
}

/**
 * ## set state
 *
 */
export function setState(newState) {
  return {
    type: SET_STATE,
    payload: newState
  }
}

/**
 * ## getState
 *
 */
export function getState(toggle) {
  return {
    type: GET_STATE,
    payload: toggle
  }
}
