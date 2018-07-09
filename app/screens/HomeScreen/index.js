import React, {Component} from "react";
import {StyleSheet, Dimensions, View, ScrollView} from 'react-native';
import {createStackNavigator, StackNavigator} from 'react-navigation';
import {Card, Button} from 'react-native-elements';
import {Tabs, Tab,ScrollableTab } from "native-base";
import ClubDetailScreen from '../../components/ClubDetail/ClubDetailScreen';
import TextEditScreen from '../MyScreen/TextEditScreen';
import LabelsEditScreen from '../MyScreen/LabelsEditScreen';
import ActivityAddScreen from './ActivityAddScreen';
import ClubAddScreen from './ClubAddScreen';
import ClubEditScreen from './ClubEditScreen';
import MapScreen from './MapScreen';
import LabeledIcon from '../../components/LabeledIcon';
import ClubTab from './ClubList';
import FriendTab from './FriendList';
import * as globalActions from '../../reducers/global/globalActions';

import normalize from '../../lib/normalizeText'
import BottomText from "../../components/BottomText";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class MainScreenComponent extends Component {
  constructor() {
    super();
    this.state = {
      enabled:true
    };
  }
  componentWillMount () {
    this.props.actions.refreshClubList(this.props.userId)
  }
  closeScrollEnabled=()=>{
    console.log('close')
    this.setState({enabled:false})
  }
  openScrollEnabled=()=>{
    console.log('open')
    this.setState({enabled:true})
  }
  render() {
    const {navigation} = this.props;
    return (
      <ScrollView scrollEnabled={this.state.enabled}>
        <Card containerStyle={styles.block}>
          <Button icon={{name: 'search'}} title="搜索"
                  borderRadius={8}
                  buttonStyle={{padding: 2}}
                  fontSize={12}
                  onPress={() => navigation.navigate('DiscoverTab')}/>
          <View style={styles.row}>
            <LabeledIcon navigation={navigation}
                         jumpTo='ActivityAdd'
                         ion="flag-checkered" type="font-awesome" label='组织活动'/>
            <LabeledIcon navigation={navigation} ion="edit" type="font-awesome" label='管理活动'/>
            <LabeledIcon navigation={navigation} ion="browser" type="octicon" label='免费短信'/>
          </View>
          <View style={styles.row}>
            <LabeledIcon navigation={navigation} ion="clippy" type="octicon" label='问卷调查'/>
            <LabeledIcon navigation={navigation} ion="check-square-o" type="font-awesome" label='活动签到'/>
            <LabeledIcon navigation={navigation} ion="note" type="octicon" label='电子票'/>
          </View>
        </Card>
        <Tabs renderTabBar={() => <ScrollableTab />}>
          <Tab heading="俱乐部">
            <ClubTab openScrollEnabled={this.openScrollEnabled}
                     closeScrollEnabled={this.closeScrollEnabled}
                     {...this.props}/>
          </Tab>
          <Tab heading="好友">
            <FriendTab navigation = {this.props.navigation}/>
          </Tab>
          <Tab heading="活动聊天组">
            <ClubTab openScrollEnabled={this.openScrollEnabled}
                     closeScrollEnabled={this.closeScrollEnabled}
                     {...this.props}/>
          </Tab>
        </Tabs>
        <BottomText>已经到底了</BottomText>
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  return {userId:state.global.currentUser.userId,
    memberClubs:state.global.memberClubs,
    chiefClubs:state.global.chiefClubs
  };
};

const MainScreen = connect(mapStateToProps, mapDispatchToProps)(MainScreenComponent);
const HomeScreen = createStackNavigator({
  Home: {
    screen: MainScreen,
    navigationOptions: {
      title: '微聚',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  ClubDetail:{
    screen: ClubDetailScreen,
    navigationOptions: {
      title: '俱乐部详情',
      headerTitleStyle: {
        alignSelf: 'center',
      }
    },
  },
  ClubAdd: {
    screen: ClubAddScreen,
    navigationOptions: {
      title: '创建俱乐部',
      headerTitleStyle: {
        alignSelf: 'center',
      }
    },
  },
  ClubEdit:{
    screen:ClubEditScreen,
    navigationOptions: {
      title: '修改信息',
    }
  },
  ActivityAdd:{
    screen: ActivityAddScreen,
    navigationOptions: {
      title: '组织活动',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  HomeTextEdit:{
    screen: TextEditScreen,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.title}`,
      headerTitleStyle: {
        alignSelf: 'center',
      }
    }),
  },
  HomeLabelsEdit:{
    screen: LabelsEditScreen,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.title}`,
      headerTitleStyle: {
        alignSelf: 'center',
      },
    }),
  },
  HomeMap:{
    screen: MapScreen,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.title}`,
      headerTitleStyle: {
        alignSelf: 'center',
      }
    }),
  },
});
const styles = StyleSheet.create({
  row: {flex: 1, flexDirection: 'row', marginVertical: 10},
  col: {flex: 1, flexDirection: 'column'},
  block: {
    marginLeft: 0, marginRight: 0,
     marginTop: 2,padding:0, paddingTop: 10},
  findMore:{fontSize:normalize(16),margin:30,alignSelf:'center'},
});
export default HomeScreen;