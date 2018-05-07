import React, {Component} from "react";
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Card, List, Avatar,ListItem} from 'react-native-elements';
// import ListItem from '../CommonComponent/ListItem';
import ExpanableList from 'react-native-expandable-section-flatlist';

class AllKindClubList extends Component {
  nameList = ['我创建的俱乐部', '我管理的俱乐部', '我加入的俱乐部'];
  varList = ['chiefClubs', 'chiefClubs', 'memberClubs'];
  kindstate = [true,true,false];
  getData(clubs) {
    let result = [];

    for (let j = 0; j < this.nameList.length; j++) {
      let tmpList = {};
      tmpList['header'] = this.nameList[j];
      tmpList['member'] = clubs[this.varList[j]];
      result.push(tmpList);
    }
    return result;
  }

  _renderRow = (l, i, sectionId) => {
    const {navigation} = this.props;
    return (<ListItem
      avatar={
        <Avatar large
                containerStyle={{borderRadius: 10}}
                overlayContainerStyle={{borderRadius: 10}}
                avatarStyle={{borderRadius: 10}}
                source={{uri: l.favicon}}
        />
      }
      key={i}
      onPress={() => navigation.navigate('ClubDetail', {...l})}
      title={l.name}
      subtitle={l.slogan}
    />);
  }
  _getCount(clubs){
    let result = new Map();
    for (let j = 0; j < this.varList.length; j++) {
      result.set(j,clubs[this.varList[j]].length);
    }
    return result;
  }
  _renderSection = (section, sectionId) =>{
    kindCount = this._getCount(this.props);
    return (
      <ListItem
        title={section}
        onPress = {()=>{
          this.kindstate[sectionId] = !this.kindstate[sectionId];
          this.ExpandableList.setSectionState(sectionId,this.kindstate[sectionId]);
        }}
        rightIcon={this.kindstate[sectionId]?
          {name:'chevron-down',type:'entypo'}:
          {name:'chevron-right'}}
        badge={{ value:kindCount.get(sectionId)}}
      />
    );
  }

  render() {
    return (
      <ExpanableList
        ref={instance => this.ExpandableList = instance}
        dataSource={this.getData(this.props)}
        headerKey="header"
        memberKey="member"
        renderRow={this._renderRow}
        renderSectionHeaderX={this._renderSection}
        openOptions={[0, 1,]}
      />
    )
  }
}
const styles = StyleSheet.create({
  block: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
});
export default AllKindClubList;