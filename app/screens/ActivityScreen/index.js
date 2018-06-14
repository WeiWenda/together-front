import React, {Component} from "react";
import {createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';
import ActivityDetailScreen from '../../components/ActivityDetail/ActivityDetailScreen';
import ActivityList from './ActivityList'
import {connect} from 'react-redux';
import {deepCopy} from '../../lib/helpFunctions';
import * as globalActions from '../../reducers/global/globalActions';
import {bindActionCreators} from "redux";
import {  Toast} from 'native-base';

const enterableList = ({ navigation,screenProps }) => (
  <ActivityList type="enterable" dst="enterableActivities" data={screenProps.enterableActivities} navigation={navigation}/>
);
const preparingList = ({ navigation,screenProps }) => (
  <ActivityList type="preparing" dst="preparingActivities" data={screenProps.preparingActivities} navigation={navigation}/>
);
const goingList = ({ navigation,screenProps }) => (
  <ActivityList type="going" dst="goingActivities" data={screenProps.goingActivities} navigation={navigation}/>
);
const doneList = ({ navigation,screenProps }) => (
  <ActivityList type="done" dst="doneActivities" data={screenProps.doneActivities} navigation={navigation}/>
);

const ListTabScreen = createMaterialTopTabNavigator(
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
  static router = ListTabScreen.router;
  componentWillMount () {
    this.props.actions.refreshActivityList(this.props.userId)
  }

  componentDidUpdate() {
    if(this.props.toast)
      Toast.show({
        text: this.props.toast,
        position: 'bottom',
        duration: 3000,
        onClose:()=>{
          this.props.actions.receiveToast(null);
        }
      })
  }
  render() {
    return (
      <ListTabScreen navigation={this.props.navigation} screenProps={this.props.lists}/>
    )
  }
}
/**
 * @Author: weiwenda
 * @Description: 为了添加列表数据，使用View进行简单嵌套
 * @Date: 下午7:17 2017/10/26
 */
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  const {goingActivities, doneActivities, preparingActivities, enterableActivities} =state.global;
  return {
    userId:state.global.currentUser.userId,
    toast: state.toast,
    lists:deepCopy({
    goingActivities:goingActivities,
    doneActivities:doneActivities,
    preparingActivities:preparingActivities,
    enterableActivities:enterableActivities,
  })};
};

const TabsScreen = connect(mapStateToProps, mapDispatchToProps)(TabsScreenComponent);

const ActivityScreen = createStackNavigator({
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