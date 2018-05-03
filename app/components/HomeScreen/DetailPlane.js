import React, {Component} from "react";
import {View,WebView,Text} from 'react-native';
import {TabNavigator} from 'react-navigation';
import colors from '../config/colors';
import normalize from '../functions/normalizeText';


const activitiesPlane = ({navigation, screenProps}) => (
  <View ><Text>你好</Text></View>
);
  // console.log(screenProps);
  // return(
  //   <WebView style={{height:400}} scalesPageToFit={true} source={{html:screenProps.introduction}}/>
  // );
const photosPlane = ({navigation, screenProps}) => (
  <View ><Text>你好</Text></View>
);

const DetailPlaneNavigator = TabNavigator(
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
      activeTintColor: colors.grey3,
      labelStyle: {
        color:'black',
        fontSize: normalize(16),
      },
      style: {
        backgroundColor:'white',
      },
    }
  }
);
export default DetailPlaneNavigator;