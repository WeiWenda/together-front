import {ADD_LABEL}from '../actions/types';
import {server} from '../components/config/urls';
import shortid from 'shortid';
import {store } from '../components/VtogetherHome';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const addLabel = (state, action) => {
  fetch(`${server}user/addLabel`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      id: action.data.type,
      detailName: action.data.content,
    })
  })
    .then((response) => response.text())
    .then(text => console.log(text));
};

const habitReducer = (state, action) => {
  switch (action.type) {
    case ADD_LABEL:
      addLabel(state, action);
      if(state.labels.length===1)
        state.labels.splice(0,0,{key:1,name:'自定义标签',
          details:[{key: shortid.generate(), name: action.data.content}]});
      else{
        if(!state.labels[0]['details'].find(item=>item.name===action.data.content))
          state.labels[0]['details'].push({key: shortid.generate(), name: action.data.content});
      }
  }
  return state;
};
export default habitReducer;