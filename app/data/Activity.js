
class Activity {
  constructor(favicon, name,chiefId) {
    this.organizerId = chiefId;
    this.favicon = favicon;
    this.name = name;
    this.startTime = '未设置';
    this.prepareTime = '未设置';
    this.duration = '未设置';
    this.address = '未设置';
    this.privilege = 0;
    this.notes = '';
  }
  set(domain,content) {
    this[domain] = content;
    return Object.assign( Object.create( Object.getPrototypeOf(this)), this)
  }
}

export default Activity;
