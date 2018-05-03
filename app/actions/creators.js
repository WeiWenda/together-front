import {
  ADD_CLUB,
  SAVE_CLUB,
  REFRESH_CLUBLIST,
  LOAD_CLUBLIST,
  EDIT_USER,
  UPLOAD_IMAGE,
  ADD_LABEL,
  ADD_ACTIVITY,
  SAVE_ACTIVITY,
  LOAD_ACTIVITY,
  REFRESH_ACTIVITYLIST,
  PART_ACTIVITY,
  RECEIVE_TOAST,
} from "./types";
export const editUser = (domain,content)=>{
  return {type:EDIT_USER,data :{domain:domain,content:content}};
};
export const uploadImage = (domain,uri,callback)=>{
  return {type:UPLOAD_IMAGE,data :{domain:domain,uri:uri,callback}};
};
export const addLabel = (type,content)=>{
  return {type:ADD_LABEL,data :{type:type,content:content}};
};

export const addClub = (domain,content) => {
  return { type: ADD_CLUB, data: {domain:domain,content:content} };
};
export const saveClub = () => {
  return { type: SAVE_CLUB, data: {} };
};
export const addActivity= (domain,content) => {
  return { type: ADD_ACTIVITY, data: {domain:domain,content:content} };
};
export const saveActivity = (data) => {
  return { type: SAVE_ACTIVITY, data: {...data} };
};
export const refreshActivityList = () => {
  return { type: REFRESH_ACTIVITYLIST, data: {} };
};
export const loadActivityList = (domain,data) => {
  return { type: LOAD_ACTIVITY, data: {domain:domain,data:data }};
};
export const refreshClubList = () => {
  return { type: REFRESH_CLUBLIST, data: {} };
};

export const loadClubList = (domain,data) => {
  return { type: LOAD_CLUBLIST, data: {domain:domain,data:data }};
};
export const partActivity = (uid,aid) => {
  return { type: PART_ACTIVITY, data: {uid:uid,aid:aid }};
};
export const receiveToast = (data) => {
  return { type: RECEIVE_TOAST, data: data};
};

