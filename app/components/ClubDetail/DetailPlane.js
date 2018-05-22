import React, {Component} from "react";
import {View,Text} from 'react-native';
import {createMaterialTopTabNavigator, TabNavigator} from 'react-navigation';
import normalize from '../../lib/normalizeText';


const activitiesPlane = ({navigation, screenProps}) => (
  <View ><Text>你好</Text></View>
);
const photosPlane = ({navigation, screenProps}) => (
  <View ><Text>你好</Text></View>
);

const DetailPlaneNavigator = createMaterialTopTabNavigator(
  {
    activities: {
      screen: activitiesPlane,
      navigationOptions: {
        title: '活动'
      },
    },
    photos: {
      screen: photosPlane,
      navigationOptions: {
        title: '相册'
      },
    }
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    tabBarOptions: {
      labelStyle:{
        fontSize:normalize(12)
      },
      tabStyle:{
        justifyContent:'center'
      },
      showIcon:false
    }
  }
);
export default DetailPlaneNavigator;