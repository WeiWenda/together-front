import React, {Component} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

import {GiftedChat, Actions, Bubble, SystemMessage} from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import * as globalActions from '../../reducers/global/globalActions';
import {connect} from "react-redux";
import {Toast} from 'native-base'
import {bindActionCreators} from "redux";
import store from 'react-native-simple-store';
import {_formatPayloadToSessionItem, _saveMessageToLocalStore} from "../../lib/helpFunctions";
import _ from 'lodash'

class ChatRoomScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };
    this._userHasBeenInputed = false;
    this._isMounted = false;
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  // 不要和动画效果抢系统资源
  componentDidMount() {
    this._isMounted = true;
    let params = this.props.navigation.state.params;
    this.currentChatKey = `${this.props.currentUser.userId}-${params.userId}`;
    this.fillCurrentChatRoomHistory();
    this.bindWebSocket(this.props.ws)
  }

  // 聊天室相关方法
  fillCurrentChatRoomHistory = async (page = 0, pageSize = 12) => {
    if (this.currentChatKey) {
      let results;
      if (typeof page === 'number' && page === 0) {
        // 异步更新
        results = await this._restoreMessageFromLocalStore(this.currentChatKey, page, pageSize);
        this.setState({messages: results})
      } else {
        results = await this._restoreMessageFromLocalStore(this.currentChatKey, page, pageSize);
        this.setState({messages: results.concat(...this.state.messages)})
      }
      return results.length;
    }
    return 0;
  };

  /**
   * 从历史恢复消息
   * 每次取的数目还不能超过 13 条，不然由于 listView 懒加载，无法滚动到底部
   */
  _restoreMessageFromLocalStore = async (key, page = 0, pageSize) => {
    let history = await store.get(`message:history:${key}`);
    if (history) {
      let historyUUIDs = history.split(',').slice(-(pageSize * (page + 1)), -(pageSize * page) || undefined).map(uuid => `message:item:${uuid}`);
      //historyUUIDs是一个数组，应当用getMulti
      let messageArray = await AsyncStorage.multiGet(historyUUIDs);
      let messages = messageArray.map((item) => {
        return JSON.parse(item[1]);
      }).reverse();
      return messages;
    } else {
      return [];
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.actions.clearUnReadMessageCount(this.currentChatKey);
  }

  bindWebSocket(ws) {
    ws.addEventListener("message", (event) => {
      let payloads = JSON.parse(event.data);
      if(payloads instanceof Array){
        for (payload of payloads) {
          let pl = Object.assign(payload,{localeExt:false});
          this.onReceive(pl);
        }
      }
    });
  }

  componentDidUpdate(preprops) {
    if (preprops.ws != this.props.ws) {
      this.bindWebSocket(this.props.ws);
    }
    if (this.props.toast)
      Toast.show({
        text: this.props.toast,
        position: 'bottom',
        duration: 1000,
        onClose: () => {
          this.props.actions.receiveToast(null);
        }
      })
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('../../data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend = (messages = []) => {
    this._userHasBeenInputed = true;
    let payloads = messages.map(message => Object.assign({}, message,
      {
        from: this.props.currentUser.userId,
        to: this.props.navigation.state.params.userId,
        localeExt: true,
        toInfo: this.props.navigation.state.params,
        ext: {
          avatar: this.props.currentUser.favicon,
          name: this.props.currentUser.name
        }
      }));
    this.pushLocalePayload(payloads);
  };

  // 本地消息入口，本地 payload 推入，只有单条推入
  pushLocalePayload(payloads) {
    //修改sessionList
    let payload = payloads[payloads.length - 1];
    let sessionItem = _formatPayloadToSessionItem(this.props.sessionListMap, payload);
    this.props.actions.addSession(String(sessionItem.key), sessionItem);
    //修改本地IMUI
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, payloads),
      };
    });
    //永久保存信息
    _saveMessageToLocalStore(this.currentChatKey, payloads);
    //websocket发送消息
    this.props.ws.send(JSON.stringify(
      {
        type:'message:one->one',
        from: this.props.currentUser.userId,
        to: this.props.navigation.state.params.userId,
        data: payloads
      }
    ));
  }


  onReceive(payload) {
    console.log(payload)
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: payload.text,
          createdAt: new Date(),
          user: {
            _id: payload.from,
            name: payload.ext.name,
            avatar: payload.ext.avatar,
          },
        }),
      };
    });
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {
      },
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    // console.log(this.state.messages);
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}

        user={{
          _id:this.props.currentUser.userId, // sent messages should have same user._id
        }}

        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  return {
    currentUser: state.global.currentUser,
    toast: state.toast,
    ws: state.global.ws,
    sessionListMap: state.global.sessionListMap,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomScreen);

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});