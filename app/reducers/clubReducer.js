const {ADD_CLUB, SAVE_CLUB, UPDATE_CLUB,REMOVE_CLUB} = require('../lib/loginConf/constants').default;
import {server} from '../lib/urls';
import {store} from '../VtogetherHome';
import Club from '../data/Club';
import {refreshClubList} from './global/globalActions';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const saveClub=(state)=>{
   return fetch(`${server}/club/add`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(state)
  })
    .then((response) => response.text())
};
function updateClub(data) {
  return fetch(`${server}/club/update`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
    .then((response) => response.text())
}

function removeClub(data) {
  return fetch(`${server}/club/delete`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
    .then((response) => response.text())
}
export const initialState = new Club('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn', "默认", 1);

const clubReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CLUB:
      return state.set(action.data.domain,action.data.content);
    case SAVE_CLUB:
      saveClub(state).then(text=>{
        console.log(text)
        store.dispatch(refreshClubList(action.data.userId));
      });
      return new Club('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn',"默认",1);
    case UPDATE_CLUB:
      updateClub(action.data).then(text=>store.dispatch(refreshClubList(action.data.userId)));
      break;
    case REMOVE_CLUB:
      removeClub(action.data).then(text=>store.dispatch(refreshClubList(action.data.userId)));
      break;
  }
  return state;
};
export default clubReducer;