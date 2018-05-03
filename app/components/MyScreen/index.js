import React, {Component} from "react";
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {Card, List, ListItem, Button, Avatar, Text} from 'react-native-elements';
import {StackNavigator} from 'react-navigation'
import colors from '../config/colors';
import LabeledNumber from '../CommonComponent/LabeledNumber';
import ProfileScreen from './UserDataScreen'
import TextEditScreen from './TextEditScreen'
import LabelsEditScreen from './LabelsEditScreen';
class ListScreen extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <ScrollView style={styles.greyBackground}>
        <Card containerStyle={[styles.block, {marginTop: 0}]}>
          <View style={styles.row}>
            <View style={{flex: 1}}/>
            <View style={{flex: 2}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Profile')}
              >
                <Avatar rounded
                        containerStyle={{alignSelf: 'center'}}
                        large
                        source={require('../../assets/NavLogo.png')}
                />
                <Text h4 style={{textAlign: 'center', marginTop: 10, marginBottom: 30}}>
                  炫Star
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start'}}>
              <Button backgroundColor="#FFF"
                      onPress={() => this.props.navigation.navigate('Profile')}
                      color="black"
                      buttonStyle={{padding: 5, paddingLeft: 10, paddingRight: 10, borderWidth: 1}}
                      title="资料" borderRadius={16}/>
            </View>
          </View>
          <View style={styles.row}>
            <LabeledNumber navigation={navigation} label="俱乐部" num="5"/>
            <LabeledNumber navigation={navigation} label="活动" num="5"/>
            <LabeledNumber navigation={navigation} label="相册" num="5"/>
          </View>
        </Card>
        <List>
          <ListItem leftIcon={{name: "md-card", type: "ionicon", color: 'black'}}
                    title='钱包'
          />
        </List>
        <List>
          <ListItem leftIcon={{name: "md-cube", type: "ionicon", color: 'black'}}
                    title='收藏'
          />
          <ListItem leftIcon={{name: "md-photos", type: "ionicon", color: 'black'}}
                    title='相册'
          />
          <ListItem leftIcon={{name: "md-folder-open", type: "ionicon", color: 'black'}}
                    title='卡包'
          />
          <ListItem leftIcon={{name: "ios-happy", type: "ionicon", color: 'black'}}
                    title='表情'
          />
        </List>
        <List>
          <ListItem leftIcon={{name: "md-share", type: "ionicon", color: 'black'}}
                    title='邀请好友'
          />
          <ListItem leftIcon={{name: "md-phone-portrait", type: "ionicon", color: 'black'}}
                    title='绑定账号'
          />
          <ListItem leftIcon={{name: "md-settings", type: "ionicon", color: 'black'}}
                    title='设置'
          />
        </List>
      </ScrollView>
    );
  }
}

const MyScreen = StackNavigator({
  MyList: {
    screen: ListScreen,
    navigationOptions: {
      title: '我',
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      title: '个人信息',
      headerTitleStyle: {
        alignSelf: 'center',
      }
    }
  },
  TextEdit: {
    screen: TextEditScreen,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.title}`,
      headerTitleStyle: {
        alignSelf: 'center',
      },
      headerRight: <View/>
    }),
  },
  LabelsEdit: {
    screen: LabelsEditScreen,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.title}`,
      headerTitleStyle: {
        alignSelf: 'center',
      },
    }),
  },
});
const styles = StyleSheet.create({
  row: {flex: 1, flexDirection: 'row'},
  block: {marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0},
  greyBackground: {backgroundColor: colors.grey5}
});
export default MyScreen;