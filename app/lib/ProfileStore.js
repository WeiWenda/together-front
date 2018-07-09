/**
 * <plusmancn@gmail.com> created at 2017
 *
 * Copyright (c) 2017 plusmancn, all rights
 * reserved.
 *
 * @flow
 *
 * 用户信息
 */

import {autorun, observable} from 'mobx';

export default class ProfileStore {
  friendList: Object = {};
  STORAGE_KEY_FRIEND_LIST = 'IM_FRIEND_LIST';

  socket: Object;

  constructor(socket: Object) {
    //  绑定 socket 对象
    this.socket = socket;
  }

  // 更新用户的 socket 信息
  updateSocketInfo = async () => {
    if (this.userInfo && this.socket.socketId) {
      if (this.socket.socketId !== this.userInfo.socketId) {
        await this.modifyUserInfo('socketId', this.socket.socketId);

        // 发送用户上线信息
        this.socket.socket.emit('user:online', {
          userId: this.userInfo.userId
        });
      }
    }
  }
}
