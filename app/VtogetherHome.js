/**
 * @flow
 */

import React, {Component} from 'react';
import { createBottomTabNavigator,createStackNavigator,createSwitchNavigator} from 'react-navigation';
import {Provider} from "react-redux";

import Ionicons from 'react-native-vector-icons/Ionicons';
import MessageScreen from './screens/MessageScreen/index';
import HomeScreen from './screens/HomeScreen/index';
import ActivityScreen from './screens/ActivityScreen/index';
import MyScreen from './screens/MyScreen/index';
import DiscoverScreen from './screens/DiscoverScreen/index';
import LoginScreen from './screens/SignInScreen/Login';
import RegisterScreen from './screens/SignInScreen/Register';
import ForgotPasswordScreen from './screens/SignInScreen/ForgotPassword';
import LoadingScreen from './screens/SignInScreen/Loading';
import configureStore from './lib/loginConf/configureStore';
import AuthInitialState from './reducers/auth/authInitialState'
import DeviceInitialState from './reducers/device/deviceInitialState'
import GlobalInitialState from './reducers/global/globalInitialState'
import {initialState as ClubInitialState}  from './reducers/clubReducer'
import {initialState as ActivityInitialState}  from './reducers/activityReducer'
import {initialState as HabitInitialState} from './reducers/habitReducer'
import {Root} from "native-base";
/**
* @Author: weiwenda
* @Description: 自动加载俱乐部列表和活动列表
* @Date: 下午7:34 2018/4/23
*/
function getInitialState () {
  const _initState = {
    auth: new AuthInitialState(),
    device: (new DeviceInitialState()).set('isMobile', true),
    global: (new GlobalInitialState()),
    toast: null,
    newClubData:ClubInitialState,
    publicData:HabitInitialState,
    newActivityData:ActivityInitialState
  }
  return _initState
}
const store = configureStore(getInitialState());

const AppStack = createBottomTabNavigator(
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
      screen: DiscoverScreen,
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

const AuthStack = createStackNavigator({
  // SignIn:SignInScreen,
  Login: LoginScreen,
  ForgotPassword:ForgotPasswordScreen,
  Register:RegisterScreen,
});
const VtogetherHome = createSwitchNavigator({
  Loading: LoadingScreen,
  App: AppStack,
  Auth: AuthStack,
});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
        <VtogetherHome/>
        </Root>
      </Provider>
    );
  }
}

export {store};
export default App;