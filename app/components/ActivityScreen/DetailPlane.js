import React, {Component} from "react";
import {View, WebView, Text, Dimensions} from 'react-native';
import {TabNavigator} from 'react-navigation';
import colors from '../config/colors';
import normalize from '../functions/normalizeText';

const introductionPlane = ({navigation, screenProps}) => {
  const BaseScript =
    `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setInterval(changeHeight, 100);
    } ())
    `;
  return (
    <WebView
      injectedJavaScript={BaseScript}
      style={{
        width: Dimensions.get('window').width - 20,
      }}
      automaticallyAdjustContentInsets
      decelerationRate='normal'
      scalesPageToFit
      javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
      scrollEnabled={false}
      onMessage={screenProps.onMessage}
      source={{
        html: screenProps.introduction
        // uri:'http://www.baidu.com'
      }}
    />
  )
};
// console.log(screenProps);
// return(
//   <WebView style={{height:400}} scalesPageToFit={true} source={{html:screenProps.introduction}}/>
// );
const photosPlane = ({navigation, screenProps}) => (
  <View><Text>你好</Text></View>
);

const DetailPlaneNavigator = TabNavigator(
  {
    introdution: {
      screen: introductionPlane,
      navigationOptions: {
        title: '详情'
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
      tabStyle: {
        borderRightWidth: 1,
        borderRightColor: colors.greyOutline,
      },
      labelStyle: {
        margin: 0,
        color: colors.grey2,
        fontSize: normalize(14),
      },
      style: {
        paddingVertical: 10,
        backgroundColor: 'white',
      },
    }
  }
);
export default DetailPlaneNavigator;