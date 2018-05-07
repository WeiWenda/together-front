import React, {Component} from "react";
import {StyleSheet, ScrollView, View } from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Card, Button, List, Avatar,Text} from 'react-native-elements';
import {Tabs, Tab,ScrollableTab } from "native-base";
import ClubList from './AllKindClubList';
import ClubScreen from './ClubScreen';
import ClubDetailScreen from './ClubDetailScreen';
import TextEditScreen from '../MyScreen/TextEditScreen';
import LabelsEditScreen from '../MyScreen/LabelsEditScreen';
import ActivityAddScreen from './ActivityAddScreen';
import ClubAddScreen from './ClubAddScreen';
import MapScreen from './MapScreen';
import LabeledIcon from '../CommonComponent/LabeledIcon';
import ClubTab from './AllKindClubList';

import normalize from '../functions/normalizeText'
import {refreshClubList} from '../../actions/creators';
import {connect } from 'react-redux';
import {deepCopy} from '../functions/helpFunctions';

class MainScreenComponent extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <ScrollView>
        <Card containerStyle={[styles.block, {marginTop: 2, paddingTop: 3}]}>
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
            <ClubTab {...this.props}/>
          </Tab>
          <Tab heading="好友">
            <ClubTab {...this.props} />
          </Tab>
          <Tab heading="活动聊天组">
            <ClubTab {...this.props}/>
          </Tab>
        </Tabs>
        <Text
          onPress ={()=>navigation.navigate('Club')}
          style={styles.findMore}>+ 发现更多</Text>
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    refreshClubList: () => {
      dispatch(refreshClubList());
    },
  };
};
const mapStateToProps = state => {
  return deepCopy(state.myClubList);
  // return state.userdata;
};

const MainScreen = connect(mapStateToProps, mapDispatchToProps)(MainScreenComponent);
const HomeScreen = StackNavigator({
  Home: {
    screen: MainScreen,
    navigationOptions: {
      title: '微聚',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  Club: {
    screen: ClubScreen,
    navigationOptions: {
      title: '俱乐部',
      headerTitleStyle: {
        alignSelf: 'center',
      }
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
  block: {marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0},
  findMore:{fontSize:normalize(16),margin:30,alignSelf:'center'},
});
export default HomeScreen;