/**
 * @flow
 */

import React, {Component} from 'react';
import {Button, ScrollView} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';

import {createStore} from "redux";
import {Provider} from "react-redux";

import Ionicons from 'react-native-vector-icons/Ionicons';
import MessageScreen from './MessageScreen';
import HomeScreen from './HomeScreen';
import ActivityScreen from './ActivityScreen';
import MyScreen from './MyScreen';
import {refreshClubList, refreshActivityList} from '../actions/creators';
import {reducer} from "../reducers/index";
/**
* @Author: weiwenda
* @Description: 自动加载俱乐部列表和活动列表
* @Date: 下午7:34 2018/4/23
*/

const store = createStore(reducer);
store.dispatch(refreshClubList());
store.dispatch(refreshActivityList());


const MyNavScreen = ({navigation, banner}) => (
  <ScrollView>
    <Button
      onPress={() => navigation.navigate('Profile', {name: 'Jordan'})}
      title="Open profile screen"
    />
    <Button
      onPress={() => navigation.navigate('NotifSettings')}
      title="Open notifications screen"
    />
    <Button
      onPress={() => navigation.navigate('SettingsTab')}
      title="Go to settings tab"
    />
    <Button onPress={() => navigation.goBack(null)} title="Go back"/>
  </ScrollView>
);

const MyHomeScreen = ({navigation}) => (
  <MyNavScreen banner="Home Screen" navigation={navigation}/>
);

const MySettingsScreen = ({navigation}) => (
  <MyNavScreen banner="Settings Screen" navigation={navigation}/>
);

const VtogetherHome = TabNavigator(
  {
    MainTab: {
      screen: HomeScreen,
      path: '/',
      navigationOptions: {
        title: '微聚',
        tabBarLabel: '首页',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{color: tintColor}}/>
        ),
      },
    },
    MessTab: {
      screen: MessageScreen,
      path: '/message',
      navigationOptions: {
        title: '消息',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'}
            size={26}
            style={{color: tintColor}}/>
        ),
      },
    },
    ActivityTab: {
      screen: ActivityScreen,
      path: '/activity',
      navigationOptions: {
        title: '活动',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'ios-list' : 'ios-list-outline'}
            size={26}
            style={{color: tintColor}}/>
        ),
      },
    },
    DiscoverTab: {
      screen: MyHomeScreen,
      path: '/discover',
      navigationOptions: {
        title: '发现',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'ios-compass' : 'ios-compass-outline'}
            size={26}
            style={{color: tintColor}}/>
        ),
      },
    },
    MyTab: {
      screen: MyScreen,
      path: '/my',
      navigationOptions: {
        title: '我',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
            name={focused ? 'ios-person' : 'ios-person-outline'}
            size={26}
            style={{color: tintColor}}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'MainTab',
    // lazy:true,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true
    }
  }
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <VtogetherHome/>
      </Provider>
    );
  }
}

export {store};
export default App;