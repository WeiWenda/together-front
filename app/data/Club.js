
class Club {
  constructor(favicon, name,chiefId) {
    this.chiefId = chiefId;
    this.favicon = favicon;
    this.name = name;
  }
  set(domain,content){
    this[domain]=content;
  }
}

export default Club;
