/**
 * <plusmancn@gmail.com> created at 2017
 *
 * Copyright (c) 2017 plusmancn, all rights
 * reserved.
 *
 * @flow
 *
 * 好友列表
 */
import React, {Component} from 'react';
import {
  RefreshControl,
  StyleSheet,
  FlatList,
} from 'react-native';
import color from '../../lib/colors';
import { ListItem} from "react-native-elements";
import * as globalActions from "../../reducers/global/globalActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BackendFactory from "../../lib/loginConf/BackendFactory";

class FriendList extends Component {

  constructor(props: Object) {
    super(props);
    this.state = {
      isRefreshing: false
    };
  }
  componentWillMount(){
    this.props.actions.refreshFriendList(this.props.userId)
  }
  handleRefresh = () => {
    this.setState({
      isRefreshing: true
    });
    BackendFactory().getFriendList(this.props.userId).then(
      (data)=>{
        this.props.actions.loadFriendList(data);
        this.setState({
          isRefreshing: false
        });
      });
  }

  renderItem = ({item}) => {
    // console.log(item)
    return (<ListItem
      roundAvatar
      avatar={{uri: item.favicon}}
      onPress={() => this.props.navigation.navigate('ChatRoom', {
        userId: item.user_id,
        avatar: item.favicon,
        name: item.name
      })}
      titleStyle={item.status === 'online' ? styles.online : ''}
      title={item.name}
    />);
  };

  render() {
    return (
      <FlatList
        // scrollEnabled={false}
        refreshControl={
          <RefreshControl
            title="正在刷新"
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleRefresh}
          />
        }
        style={styles.container}
        data={this.props.friends}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  online: {
    color: color.WechatGreen
  }
});
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  return {userId:state.global.currentUser.userId,
    friends:state.global.friends,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);
