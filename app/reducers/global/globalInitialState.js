/**
 * # globalInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict'
/**
 * ## Import
 */
import {Record} from 'immutable'

/**
 * ## InitialState
 *
 * * currentUser - object returned from server when validated
 * * showState - toggle for Header to display state
 * * currentState - object in Json format of the entire state
 * * store - the Redux store which is an object w/ 4 initial states
 *   * device
 *   * auth
 *   * global
 *   * profile
 *
 */
var InitialState = Record({
  currentUser: new (Record({
    userId: 1,
    name: "蔚文达",
    password: "GEd2NE%$O38&",
    favicon: "http://oxvctrmxs.bkt.clouddn.com/FkmsAwy0wImJ67t40EQ5dBXHhFfn",
    sex: 0,
    age: 0,
    eMail: "994184916@qq.com",
    phone: "18706793622",
    address: "山西/临汾/临汾市",
    registerTime: null,
    birthday:null,
    labels:"",
    signature: "13124124",
    seo: false,
    chief: false
  }))() ,
  showState: false,
  currentState: null,
  store: null,
  memberClubs: [],
  chiefClubs: [],
  goingActivities: [],
  doneActivities: [],
  preparingActivities: [],
  enterableActivities: []
})
export default InitialState
