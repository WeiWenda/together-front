import {EDIT_USER, UPLOAD_IMAGE}from '../actions/types';
import {store } from '../components/VtogetherHome';
import {server,qiniu,imageServer} from '../components/config/urls';
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
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
    headers: headers,
    body: JSON.stringify({
      user_id: state.user_id,
      domain: action.data.domain,
      value: action.data.content,
    })
  })
    .then((response) => response.text())
    .then(text => console.log(text));
};
const userReducer = (state, action) => {
  switch (action.type) {
    case EDIT_USER:
      updateUser(state, action);
      break;
    case UPLOAD_IMAGE:
      uploadImage(state.user_id,action.data.uri,(fileUrl)=>{
        store.dispatch(action.data.callback(action.data.domain,fileUrl));
      });
      break;
  }
  return state;
};
export default userReducer;