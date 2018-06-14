
class Club {
  constructor(favicon, name,chiefId) {
    this.chiefId = chiefId;
    this.favicon = favicon;
    this.name = name;
  }
  set(domain,content){
    this[domain]=content;
    return Object.assign( Object.create( Object.getPrototypeOf(this)), this)
  }
}

export default Club;
