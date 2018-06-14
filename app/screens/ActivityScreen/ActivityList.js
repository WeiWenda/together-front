import React, {Component} from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import { Avatar, ListItem} from 'react-native-elements';
import BackendFactory from "../../lib/loginConf/BackendFactory";
import {bindActionCreators} from "redux";
import * as globalActions from '../../reducers/global/globalActions';
import {connect} from "react-redux";

class ActivityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,//下拉控制
    }
  }
  handleRefresh = () => {
    this.setState({
      isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
    });
    BackendFactory().getActivityList(this.props.type, this.props.userId)
      .then((data) => {
        this.props.actions.loadActivityList(this.props.dst, data);
        this.setState({
          isRefreshing: false,
        });
      });
  }
  render() {
    const navigation = this.props.navigation;
    let keyExtractor = (item, index) => index;
    let renderItem = ({item}) => (
      <ListItem
        avatar={
          <Avatar
            containerStyle={{borderRadius: 10}}
            overlayContainerStyle={{borderRadius: 10}}
            avatarStyle={{borderRadius: 10}}
            width={120}
            height={90}
            source={{uri: item.favicon}}
          />
        }
        hideChevron={true}
        onPress={() => navigation.navigate('ActivityDetail', {activityId: item.activityId})}
        title={item.name}
        subtitle={item.notes}
      />
    );
    return (
      <FlatList
        keyExtractor={keyExtractor}
        data={this.props.data}
        renderItem={renderItem}
        //为刷新设置颜色
        refreshControl={
          <RefreshControl
            title="正在刷新"
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleRefresh}//因为涉及到this.state
            colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
            progressBackgroundColor="#ffffff"
          />
        }
      />
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  return {
    userId:state.global.currentUser.userId,
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);


