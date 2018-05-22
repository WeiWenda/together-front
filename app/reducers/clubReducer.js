import {ADD_CLUB, SAVE_CLUB, UPDATE_CLUB} from '../actions/types';
import {server} from '../lib/urls';
import {store} from '../VtogetherHome';
import Club from '../data/Club';
import {refreshClubList} from '../actions/creators';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const saveClub=(state)=>{
   return fetch(`${server}club/add`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(state)
  })
    .then((response) => response.text())
};
function updateClub(data) {
  return fetch(`${server}club/update`, {
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
      state.set(action.data.domain,action.data.content);
      break;
    case SAVE_CLUB:
      saveClub(state).then(text=>store.dispatch(refreshClubList()));
      state = new Club('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn',"默认",1);
      break;
    case UPDATE_CLUB:
      updateClub(action.data).then(text=>store.dispatch(refreshClubList()));
      break;
  }
  return state;
};
export default clubReducer;