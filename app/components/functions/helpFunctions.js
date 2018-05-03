import moment from 'moment';
export const deepCopy = (data)=> {
  return JSON.parse(JSON.stringify(data));
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