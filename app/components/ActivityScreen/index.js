import React, {Component} from "react";
import {View} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import ActivityDetailScreen from './ActivityDetailScreen';
import ActivityList from './ActivityList'
import {connect} from 'react-redux';
import {deepCopy} from '../functions/helpFunctions';
import {refreshActivityList} from '../../actions/creators';

const enterableList = ({ navigation,screenProps }) => (
  <ActivityList data={screenProps.enterableActivities} navigation={navigation}/>
);
const preparingList = ({ navigation,screenProps }) => (
  <ActivityList data={screenProps.preparingActivities} navigation={navigation}/>
);
const goingList = ({ navigation,screenProps }) => (
  <ActivityList data={screenProps.goingActivities} navigation={navigation}/>
);
const doneList = ({ navigation,screenProps }) => (
  <ActivityList data={screenProps.doneActivities} navigation={navigation}/>
);

const ListTabScreen = TabNavigator(
  {
    Enterable: {
      screen:  enterableList,
      path: '/activity/enterable',
      navigationOptions: {
        title: '最新'
      },
    },
    Joining: {
      screen:  preparingList,
      path: '/activity/going',
      navigationOptions: {
        title: '已报名'
      },
    },
    Preparing: {
      screen: goingList,
      path: '/activity/preparing',
      navigationOptions: {
        title: '进行中'
      },
    },
    Finished: {
      screen: doneList,
      path: '/activity/done',
      navigationOptions: {
        title: '已完成'
      },
    }
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    tabBarOptions:{
      labelStyle:{
        fontSize:14
      },
      tabStyle:{
        justifyContent:'center'
      },
      showIcon:false
    }
  });

class TabsScreenComponent extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <ListTabScreen screenProps={this.props.lists}
                       navigation={this.props.navigation} />
      </View>
    )
  }
}
TabsScreenComponent.router = ListTabScreen.router;
/**
 * @Author: weiwenda
 * @Description: 为了添加列表数据，使用View进行简单嵌套
 * @Date: 下午7:17 2017/10/26
 */
const mapDispatchToProps = (dispatch) => {
  return {
    refreshActivityList: () => {
      dispatch(refreshActivityList());
    },
  };
};
const mapStateToProps = state => {
  return {lists:deepCopy(state.myActivityList)};
};

const TabsScreen = connect(mapStateToProps, mapDispatchToProps)(TabsScreenComponent);

const ActivityScreen = StackNavigator({
  Home: {
    screen: TabsScreen,
    navigationOptions: {
      title: '活动',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  ActivityDetail:{
    screen: ActivityDetailScreen,
    navigationOptions: {
      title: '活动详情',
      headerTitleStyle: {
        alignSelf: 'center',
      }
    },
  }
});
export default ActivityScreen;