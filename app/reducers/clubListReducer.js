import {LOAD_CLUBLIST,REFRESH_CLUBLIST}from '../actions/types';
import {server} from '../components/config/urls';
import {store} from '../components/VtogetherHome';
import {loadClubList} from '../actions/creators';
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
};
export async function getClubList(param, cur_user){
  let response =await fetch(`${server}user/getClubList`, {
    method: 'POST',
    headers: headers,
    body: `type=${param}&user_id=${cur_user}`
  });
    let responseJson =await response.json();
   return responseJson.data;
}
const clubReducer = (state, action, cur_user) => {
  switch (action.type) {
    case LOAD_CLUBLIST:
      state[action.data.domain] = action.data.data;
      break;
    case REFRESH_CLUBLIST:
      getClubList('member',cur_user).then(data => {
        store.dispatch(loadClubList('memberClubs',data));
      });
      getClubList('chief',cur_user).then(data => {
        store.dispatch(loadClubList('chiefClubs',data));
      });
  }
  return state;
};
export default clubReducer;