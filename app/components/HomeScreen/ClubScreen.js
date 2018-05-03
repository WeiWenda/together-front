import React, {Component} from "react";
import {StyleSheet, ScrollView, View,TouchableHighlight } from 'react-native';
import {ButtonGroup,Button,List,Avatar} from 'react-native-elements';
import {MockClubs} from '../../data/Mocks';
import ListItem from '../CommonComponent/ListItem';
import LabeledIcon from '../CommonComponent/LabeledIcon';
import BackgroundImage from '../CommonComponent/BackgroundImage';

import colors from '../config/colors';
import normalize from '../functions/normalizeText';

class ClubScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      //默认使用用户当前爱好进行过滤
      filters:[],
      orderBy:0,
    }
  }
  updateIndex=(selectIndex)=>{
    this.setState({orderBy:selectIndex});
  };
  render() {
    const buttons = ['距离', '活跃', '好评'];
    const selectedIndex = 0;
    const navigation = this.props.navigation;
    return(
      <ScrollView>
          <BackgroundImage resizeMode="cover"
                           style={{ width: null }}
                           source={{uri:'http://oxvctrmxs.bkt.clouddn.com/ntk-1955-33314.jpg'}}>
            <View style={[styles.row,{marginVertical: 40}]}>
              <LabeledIcon white navigation={navigation} ion="search" type="octicon" label='搜索俱乐部'/>
              <LabeledIcon white
                           jumpTo='ClubAdd'
                           navigation={navigation} ion="md-add-circle" type="ionicon" label='创建俱乐部'/>
              <LabeledIcon white navigation={navigation} ion="ruby" type="octicon" label='俱乐部排行'/>
            </View>
          </BackgroundImage>
        <View style={[styles.row,{flex:1}]}>
            <ButtonGroup  onPress={this.updateIndex}
                          activeOpacity={0.2}
                          innerBorderStyle ={{color:'white'}}
                          buttons={buttons}
                          selectedIndex={this.state.orderBy}
                          selectedTextStyle={{color:'red'}}
                          selectedBackgroundColor={colors.grey5}
                          containerBorderRadius={0}
                          containerStyle={styles.buttonGroup}/>
            <Button
              Component={TouchableHighlight}
              activeOpacity={0.2}
              style={{flex:1}}
              rightIcon={{
                name:this.state.filters.length===0?'ios-funnel-outline':'ios-funnel',
                type:'ionicon',color:'red',style:{marginLeft:5}}}
              title='筛选'
              containerViewStyle={styles.container}
              buttonStyle={styles.button}
              textStyle={{ color: 'red',fontSize:normalize(13)}}/>
        </View>
        <List containerStyle={{marginTop: 0}}>
          {MockClubs.map((l, i) => (
            <ListItem
              avatar={
                <Avatar large
                        containerStyle={{borderRadius: 10}}
                        overlayContainerStyle = {{borderRadius: 10}}
                        source={require('../../assets/NavLogo.png')}
                />
              }
              key={i}
              onPress={() => console.log('do nothing')}
              title={l.name}
              subtitle={l.name}
            />
          ))}
        </List>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  buttonGroup:{
    flex:0.75,
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0,},
  button:{flex:1,padding:0,backgroundColor:'transparent'},
  container:{flexDirection: 'row',
    backgroundColor: colors.grey5,
    marginRight: 0, marginLeft: 0,flex:0.25},
  row: {flexDirection: 'row', },
});
export default ClubScreen;