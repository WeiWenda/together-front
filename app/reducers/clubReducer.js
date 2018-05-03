import {ADD_CLUB,SAVE_CLUB}from '../actions/types';
import {server} from '../components/config/urls';
import {store} from '../components/VtogetherHome';
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

const clubReducer = (state, action) => {
  switch (action.type) {
    case ADD_CLUB:
      state.set(action.data.domain,action.data.content);
      break;
    case SAVE_CLUB:
      saveClub(state).then(text=>store.dispatch(refreshClubList()));
      state = new Club('http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn',"默认",1);
      break;
  }
  return state;
};
export default clubReducer;