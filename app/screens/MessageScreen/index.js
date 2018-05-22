import React, {Component} from "react";
import {StyleSheet, ScrollView, View} from 'react-native';
import {createStackNavigator, StackNavigator} from 'react-navigation';
import { List, Avatar,Icon } from 'react-native-elements';

import ListItem from '../../components/ListItem';
import normalize from '../../lib/normalizeText'
import {MockClubs} from '../../data/Mocks';

class ChatsScreen extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <ScrollView>
        <List containerStyle={{marginTop: 0}}>
          {MockClubs.map((l, i) => (
            <ListItem
              avatar={
                <Avatar
                  containerStyle={{borderRadius: 10}}
                  overlayContainerStyle={{borderRadius: 10}}
                  width={50}
                  height={50}
                  source={require('../../lib/NavLogo.png')}
                />
              }
              // avatarStyle={{marginRight:10}}
              titleStyle={{fontSize: normalize(14)}}
              // containerStyle={{ paddingTop: 5, paddingBottom: 5,}}
              // wrapperStyle ={{marginLeft:5}}
              key={i}
              onPress={() => navigation.navigate('DiscoverTab')}
              title={l.name}
              subtitle={l.name}
            />
          ))}
        </List>
      </ScrollView>
    );
  }
}
const MessageScreen = createStackNavigator({
  Home: {
    screen: ChatsScreen,
    navigationOptions: {
      title: '消息',
      headerTitleStyle: {
        alignSelf: 'center',
      },
      headerLeft: <View/>,
      headerRight:(
          <Icon name="md-add" type = "ionicon"
                containerStyle={{marginRight:10}}
                onPress={() => console.log("") }
          />
      )
    },
  }
});
const styles = StyleSheet.create({
});
export default MessageScreen;