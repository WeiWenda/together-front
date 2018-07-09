import moment from 'moment';
import {
  Alert
} from 'react-native';
import store from 'react-native-simple-store';
import {Map} from 'immutable'
export const deepCopy = (data)=> {
  return JSON.parse(JSON.stringify(data));
};
export const contentEq = (d1,d2)=>{
  return JSON.stringify(d1) == JSON.stringify(d2);
};
export const durationUnit = ['月', '周', '天', '小时', '分钟'];

const mapper = new Map([['月','months'],['周','weeks'],
  ['天','days'],['小时','hours'],['分钟','minutes']]);

export const transformer = (startTime,duration)=>{
  let start = moment(startTime);
  let re1 = /预计(\w*)\s(.*)后/i;
  let re2 = /提前(\w*)\s(.*)/i;
  if(r=duration.match(re1)){
    return start.add(r[1],mapper.get(r[2])).format('YYYY-MM-DD HH:mm:ss');
  }else if(r=duration.match(re2)){
    return start.subtract(r[1],mapper.get(r[2])).format('YYYY-MM-DD HH:mm:ss');
  }
  return duration;
};
export async function fetchLocal (input: string, init?: Object): Object {
  try {
    let result = await fetch(input, init);
    let resultJson = await result.json();

    if (!resultJson.success) {
      Alert.alert('ImServer Error', resultJson.data.message);
    }

    return resultJson;
  } catch (e) {
    Alert.alert('Fetch Error', e);
  }
}

export function _getPayloadKey(payload) {
  if (payload.localeExt) {
    return `${payload.from}-${payload.to}`;
  } else {
    return `${payload.to}-${payload.from}`;
  }
}

/**
 * 格式化 payload
 * @param {Number} delta - 未读数步进
 */
export function _formatPayloadToSessionItem(sessionListMap,payload, delta: number = 1) {
  let sessionItem, key = _getPayloadKey(payload);
  let preSessionItem = sessionListMap.get(key);
  if (payload.localeExt) {
    sessionItem = {
      avatar: payload.toInfo.avatar,
      name: payload.toInfo.name,
      latestMessage: payload.text,
      unReadMessageCount: 0,
      timestamp: payload.createdAt,
      key: key,
      toInfo: payload.toInfo
    };
  } else {
    let ext = payload.ext;
    sessionItem = {
      avatar: ext.avatar,
      name: ext.name,
      latestMessage: payload.text,
      timestamp: payload.createdAt,
      unReadMessageCount: preSessionItem ? preSessionItem.unReadMessageCount + delta : delta,
      key: key,
      toInfo: {
        userId: payload.from,
        avatar: ext.avatar,
        name: ext.name
      }
    };
  }
  return sessionItem;
}
export async function getDataFromLocalStore(){
  // 恢复 sessionListMap
  let keys = await store.get('session:list:map:keys');
  if (keys) {
    let initArray = new Map();
    for (let key of keys.split(',')) {
      let value = JSON.parse((await store.get(`session:list:${key}`)));
      initArray = initArray.set(key, value);
    }
    return initArray;
  }
}
/**
 * 历史消息存储结构
 * message:history:${key} 存储用户的消息 id 集合
 * message:item:${uuid} 消息 uuid 集合
 */
export async function _saveMessageToLocalStore(key, payloads: Array<Object>){
  let historyKey = `message:history:${key}`;
  let history = await store.get(historyKey);

  // 聊天记录索引
  let uuids = payloads.map((payload) => {
    return payload._id;
  });
  store.save(historyKey, `${history ? history + ',' : '' }${uuids.join(',')}`);
  payloads.forEach((payload) => {
    store.save(`message:item:${payload._id}`, payload);
  });
}