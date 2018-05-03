import React, {Component} from "react";
import {StyleSheet} from "react-native";
import {Card, List, Avatar} from 'react-native-elements';
import ListItem from '../CommonComponent/ListItem';
class ClubList extends Component {

  render() {
    const {navigation} = this.props;

    return (
      <Card title={this.props.title} containerStyle={styles.block}
            dividerStyle={{height: 0, marginBottom: 0}}>
        <List containerStyle={{marginTop: 0}}>
          {this.props.data.map((l, i) => (
            <ListItem
              avatar={
                <Avatar large
                        containerStyle={{borderRadius: 10}}
                        overlayContainerStyle={{borderRadius: 10}}
                        avatarStyle={{borderRadius:10}}
                        source={{uri: l.favicon}}
                />
              }
              key={i}
              onPress={() => navigation.navigate('ClubDetail',{...l})}
              title={l.name}
              subtitle={l.slogan}
            />
          ))}
        </List>
      </Card>
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
export default ClubList;