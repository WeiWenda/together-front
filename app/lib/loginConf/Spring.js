/**
 * # Hapi.js
 *
 * This class interfaces with Hapi.com using the rest api
 * see [http://hapijs.com/api](http://hapijs.com/api)
 *
 * Singleton module see: https://k94n.com/es6-modules-single-instance-pattern
 */

'use strict'

/**
 * ## Imports
 *
 * Config for defaults and underscore for a couple of features
 */
import CONFIG from './config'
import _ from 'underscore'
import Backend from './Backend'
import {qiniu, server} from "../urls";
export class Spring extends Backend {
  /**
   * ## Spring.js client
   *
   *
   * @throws tokenMissing if token is undefined
   */
  initialize(token) {
    if (!_.isNull(token) && _.isUndefined(token.sessionToken)) {
      throw new Error('TokenMissing')
    }
    this._sessionToken =
      _.isNull(token) ? null : token.sessionToken.sessionToken

    this.API_BASE_URL = CONFIG.backend.springLocal
      ? CONFIG.Spring.local.url
      : CONFIG.Spring.remote.url
  }

  /**
   * ### signup
   *
   * @param data object
   *
   * {username: "barton", email: "foo@gmail.com", password: "Passw0rd!"}
   *
   * @return
   * if ok, res.json={createdAt: "2015-12-30T15:17:05.379Z",
   *   objectId: "5TgExo2wBA",
   *   sessionToken: "r:dEgdUkcs2ydMV9Y9mt8HcBrDM"}
   *
   * if error, {code: xxx, error: 'message'}
   */
  async signup(data) {
    return await this._fetch({
      method: 'POST',
      url: '/account/register',
      body: data
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log(res.json)
          return res.json
        } else {
          throw res.json
        }
      })
      .catch((error) => {
        throw (error)
      })
  }
  /**
   * ### login
   * encode the data and and call _fetch
   *
   * @param data
   *
   *  {username: "barton", password: "Passw0rd!"}
   *
   * @returns
   *
   * createdAt: "2015-12-30T15:29:36.611Z"
   * updatedAt: "2015-12-30T16:08:50.419Z"
   * objectId: "Z4yvP19OeL"
   * email: "barton@foo.com"
   * sessionToken: "r:Kt9wXIBWD0dNijNIq2u5rRllW"
   * username: "barton"
   *
   */
  async login(data) {
    return await this._fetch({
      method: 'POST',
      url: '/account/login',
      body: data
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.json
        } else {
          throw (res.json)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }

  /**
   * ### logout
   * prepare the request and call _fetch
   */
  async logout() {
    return await this._fetch({
      method: 'GET',
      url: '/account/logout',
      body: null
    })
      .then((res) => {
        if ((res.status === 200 || res.status === 201) ||
          (res.status === 400 && res.code === 209)) {
          return {}
        } else {
          throw new Error({code: res.statusCode, error: res.message})
        }
      })
      .catch((error) => {
        throw (error)
      })
  }

  /**
   * ### resetPassword
   * the data is already in a JSON format, so call _fetch
   *
   * @param data
   * {email: "barton@foo.com"}
   *
   * @returns empty object
   *
   * if error:  {code: xxx, error: 'message'}
   */
  async resetPassword(data) {
    return await this._fetch({
      method: 'POST',
      url: '/account/resetPasswordRequest',
      body: data
    })
      .then((response) => {
        if ((response.status === 200 || response.status === 201)) {
          return {}
        } else {
          var res = JSON.parse(response._bodyInit)
          throw (res)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }

  /**
   * ### getProfile
   * Using the sessionToken, we'll get everything about
   * the current user.
   *
   * @returns
   *
   * if good:
   * {createdAt: "2015-12-30T15:29:36.611Z"
   *  email: "barton@acclivyx.com"
   *  objectId: "Z4yvP19OeL"
   *  sessionToken: "r:uFeYONgIsZMPyxOWVJ6VqJGqv"
   *  updatedAt: "2015-12-30T15:29:36.611Z"
   *  username: "barton"}
   *
   * if error, {code: xxx, error: 'message'}
   */
  async getProfile() {
    return await this._fetch({
      method: 'GET',
      url: '/account/profile/me'
    })
      .then((res) => {
        if ((res.status === 200 || res.status === 201)) {
          return res.json
        } else {
          throw (res.json)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }

  async updateUser(data) {
    return  this._fetch({
      method: 'POST',
      url: '/user/update',
      body: data
    })
      .then((res) => {
        console.log(res)
        if ((res.status === 200 || res.status === 201)) {
          return res.json.data
        } else {
          throw (res.json.error)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }

  async uploadImage(user_id, fileuri) {
    let formData = new FormData();
    let file = {uri: fileuri, type: 'image/jpeg'};
    formData.append("file", file);
    let token = await fetch(`${server}/user/upload?user_id=${user_id}`)
    let key = await token.text();
    formData.append("token", key);
    return await this._fetch({
      method: 'POST',
      url: qiniu,
      body: formData,
    });
  }

  async partActivity(uid, aid) {
    let response = await this._fetch({
      url:'/user/signUp',
      method: 'POST',
      body: `user_id=${uid}&activity_id=${aid}`
    })
    return response.json.data;
  }

  async getClubList(param, cur_user) {
    let response = await this._fetch({
      url:`/user/getClubList`,
      method: 'POST',
      body: `type=${param}&user_id=${cur_user}`
    });
    return response.json.data;
  }

  async getActivityList(param, cur_user) {
    let response = await this._fetch({
      url:`/user/getActivityList`,
      method: 'POST',
      body: `type=${param}&user_id=${cur_user}`
    });
    return response.json.data;
  }
  // 拉取在线用户列表
  async getFriendList(cur_user) {
    let result = await this._fetch({
      method: 'GET',
      url: `/user/getFriendList?user_id=${cur_user}`,
      body: null
    })
    return result.json.data;
  }
  /**
   * ### updateProfile
   * for this user, update their record
   * the data is already in JSON format
   *
   * @param userId  _id
   * @param data object:
   * {username: "barton", email: "barton@foo.com"}
   */
  async updateProfile(userId, data) {
    return await this._fetch({
      method: 'POST',
      url: '/account/profile/' + userId,
      body: data
    })
      .then((res) => {
        if ((res.status === 200 || res.status === 201)) {
          return {}
        } else {
          throw (res.json)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }

  /**
   * ### _fetch
   * A generic function that prepares the request
   *
   * @returns object:
   *  {code: response.code,
   *   status: response.status,
   *   json: response.json()
   */
  async _fetch(opts) {
    opts = _.extend({
      method: 'GET',
      url: null,
      body: null,
      callback: null
    }, opts)

    var reqOpts = {
      method: opts.method,
      headers: {}
    }
    if (this._sessionToken) {
      reqOpts.headers['Authorization'] = 'Bearer ' + this._sessionToken
    }
    if (opts.method === 'POST' || opts.method === 'PUT') {
      if ( typeof opts.body === "string") {
        reqOpts.headers['Accept'] = 'application/json'
        reqOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      } else if(opts.body instanceof FormData){
        reqOpts.headers['Accept'] = 'application/json'
        reqOpts.headers['Content-Type'] = 'multipart/form-data'
      }else{
        reqOpts.headers['Accept'] = 'application/json'
        reqOpts.headers['Content-Type'] = 'application/json'
      }
    }

    if (opts.body) {
      if (opts.body instanceof FormData || typeof opts.body === 'string')
        reqOpts.body = opts.body
      else
        reqOpts.body = JSON.stringify(opts.body)
    }

    let url =/http:.*/i.test(opts.url)?opts.url:this.API_BASE_URL + opts.url
    let res = {}

    let response = await fetch(url, reqOpts)
    res.status = response.status
    res.code = response.code
    // console.log(url,reqOpts,response.text())
    return response.json()
      .then((json) => {
        res.json = json
        return res
      }).catch((error)=>{
        console.log("Api call error");
        alert(error.message);
      })
  }
}

// The singleton variable
export let spring = new Spring()
