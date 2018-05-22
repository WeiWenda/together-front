import React, {Component} from 'react';
import {View, Text} from 'react-native';

import colors from '../lib/colors';

export default TablelikeItem = ({content, title, right}) => {
  return (
    <View style={{flexDirection: 'row',padding:10,borderBottomWidth:1,borderBottomColor:colors.greyOutline}}>
      <View style={{flex: 1,borderRightColor:colors.greyOutline,borderRightWidth:1,alignItems:'center'
      ,paddingRight:10}}>
        <Text> {title}</Text>
      </View>
      <View style={{flex: 4, paddingLeft: 20}}>
        {React.isValidElement(content)
        && content
        }
      </View>
      <View style={{flex: 0.5}}>
        {React.isValidElement(right)
        && right
        }
      </View>
    </View>
  );
}