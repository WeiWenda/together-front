import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Card, List, Avatar, ListItem} from 'react-native-elements';
// import ListItem from '../components/ListItem';
import ExpanableList from 'react-native-expandable-section-flatlist';

class AllKindClubList extends Component {
  nameList = ['我创建的俱乐部', '我管理的俱乐部', '我加入的俱乐部'];
  varList = ['chiefClubs', 'chiefClubs', 'memberClubs'];
  // kindstate = [true, true, false];
  kindstate = [false, false, false];

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

  _getCount(clubs) {
    let result = new Map();
    for (let j = 0; j < this.varList.length; j++) {
      result.set(j, clubs[this.varList[j]].length);
    }
    return result;
  }

  _renderSection = (section, sectionId) => {
    kindCount = this._getCount(this.props);
    return (
      <ListItem
        title={section}
        onPress={() => {
          this.kindstate[sectionId] = !this.kindstate[sectionId];
          this.ExpandableList.setSectionState(sectionId, this.kindstate[sectionId]);
        }}
        rightIcon={this.kindstate[sectionId] ?
          {name: 'chevron-down', type: 'entypo'} :
          {name: 'chevron-right', type: 'entypo'}}
        badge={{value: kindCount.get(sectionId)}}
      />
    );
  }

  render() {
    return (
      <View>
        <ListItem
          title="创建新的俱乐部"
          onPress={() => this.props.navigation.navigate("ClubAdd")}
          rightIcon={{name: 'add'}}
        />
        <ExpanableList
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1}}
          ref={instance => this.ExpandableList = instance}
          dataSource={this.getData(this.props)}
          headerKey="header"
          memberKey="member"
          renderRow={this._renderRow}
          renderSectionHeaderX={this._renderSection}
          openOptions={this.kindstate.map((e,i)=>[e,i]).filter(e=>e[0]).map(e=>e[1])}
        />
      </View>
    )
  }
}
export default AllKindClubList;