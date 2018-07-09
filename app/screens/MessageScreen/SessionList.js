/**
 * <plusmancn@gmail.com> created at 2017
 *
 * Copyright (c) 2017 plusmancn, all rights
 * reserved.
 *
 * @flow
 *
 * 聊天会话窗口
 */

import React from 'react';
import {
  AppState,
  Platform,
  StyleSheet,
  Image,
  Text,
  View, FlatList
} from 'react-native';

import { ListItem} from "react-native-elements";
import * as globalActions from '../../reducers/global/globalActions';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import store from 'react-native-simple-store';
import Swipeout from "../../components/Swipeout/index";
import moment from 'moment';
import Color from '../../lib/colors';
import Avatar from "react-native-badge-avatar";
import {_formatPayloadToSessionItem, _saveMessageToLocalStore} from "../../lib/helpFunctions";

class SessionList extends React.Component {

  constructor(props) {
    super(props);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillMount() {
    this.props.actions.initialWebSocket();
    this.props.actions.restoreDataFromLocalStore()
  }

  componentDidUpdate(preprops) {
    if (preprops.ws != this.props.ws) {
      this.bindWebSocket(this.props.ws)
    }
  }

  sessionList(): Array<Object> {
    return [...this.props.sessionListMap.values()].sort(function (a, b) {
      return b.timestamp - a.timestamp;
    }).map(function (item) {
      item.latestTime = moment(item.timestamp).startOf('minute').fromNow();
      return item;
    });
  }

  bindWebSocket(ws) {
    ws.onopen = () => {
      // 打开一个连接
      console.log('connected!');
      ws.send(JSON.stringify({
        type:'user:online',
        userId: this.props.userId
      }));
      this.props.actions.receiveToast("登录成功");
    };
    ws.addEventListener("message", (event) => {
      let payloads = JSON.parse(event.data);
      if(payloads instanceof Array){
        let payload = Object.assign(payloads[payloads.length - 1],{localeExt:false});
        console.log(payload);
        let sessionItem = _formatPayloadToSessionItem(this.props.sessionListMap,payload,payloads.length);
        this.props.actions.addSession(String(sessionItem.key), sessionItem);

        _saveMessageToLocalStore(String(sessionItem.key), payloads)
      }
    });
    ws.onerror = (e) => {
      // 发生了一个错误
      console.log(e.message);
    };
    ws.onclose = (e) => {
      // 连接被关闭了
      console.log(e.code, e.reason);
    };
  }

  clear = async () => {
    let keys = await store.keys();
    for (key of  keys) {
      store.delete(key)
    }
  };
  /**
  * @Author: weiwenda
  * @Description: 计算总的未读消息数
  * @Date: 下午3:25 2018/6/17
  */

  unReadMessageCountTotal(): number {
    let unReadMessageCountTotal = 0;
    [...this.props.sessionListMap.values()].forEach(function (item) {
      unReadMessageCountTotal += item.unReadMessageCount;
    });
    return unReadMessageCountTotal;
  }

  /**
   * Session 存储结构如下
   * session:list:map:keys 存放 map key 值列表
   * session:list:key 存储最新一条消息信息
   */
  _saveDataToLocalStore = () => {
    // 处理 sessionListMap
    store.save('session:list:map:keys', [...this.props.sessionListMap.keys()].join(','));
    for (let [key, value] of this.props.sessionListMap.entries()) {
      store.save(`session:list:${key}`, JSON.stringify(value));
    }
  };


  _handleAppStateChange = (appState) => {
    if (Platform.OS === 'ios' && appState === 'inactive') {
      this.props.ws.close();
      this._saveDataToLocalStore();
    }

    if (Platform.OS === 'android' && appState === 'background') {
      this.props.ws.close();
      this._saveDataToLocalStore();
    }

    if (appState === 'active') {
      this.props.actions.initialWebSocket();
      this.props.actions.restoreDataFromLocalStore()
    }
  }

  renderItem = ({item}) => {
    return (
      <Swipeout
        key={item.key}
        rightButtons={[{
          title: '删除',
          type: 'Delete',
          onPress: () => {
            this.props.actions.deleteSession(item.key);
          }
        }]}
      >
        <ListItem
          containerStyle={{backgroundColor:Color.White}}
          avatar={
            <Avatar
              size={40}
              source={item.avatar}
              badge={item.unReadMessageCount}
            />
          }
          title={item.name}
          hideChevron
          subtitle={item.latestMessage}
          rightTitle={item.latestTime}
          onPress ={()=>{
            this.props.navigation.navigate('ChatRoom', {...item.toInfo})
          }
          }
        />
      </Swipeout>
    );
  };

  render() {
    if (this.props.sessionListMap.size) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.sessionList()}
            renderItem={this.renderItem}
          />
        </View>
      );
    } else {
      return (
        <View
          style={styles.emptyMessage}
        >
          <Image
            source={{
              uri: 'http://image-2.plusman.cn/app/im-client/empty-message.png'
            }}
            style={styles.emptyMessageImage}
          />
          <Text
            style={styles.emptyMessageText}
          >暂无消息</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: Color.BackgroundGrey
  },
  emptyMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyMessageImage: {
    width: 90,
    height: 90,
    opacity: 0.6
  },
  emptyMessageText: {
    color: Color.LightBlack,
    fontSize: 14
  },
  avatar: {
    borderRadius: 4,
    width: 50,
    height: 50
  },
  cellBadge: {
    position: 'absolute',
    top: 2,
    right: 0
  },
});
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  return {
    userId: state.global.currentUser.userId,
    toast: state.toast,
    ws: state.global.ws,
    sessionListMap: state.global.sessionListMap
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionList);

