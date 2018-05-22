import React, {Component} from "react";
import {ScrollView} from 'react-native';
import {List, Avatar,ListItem} from 'react-native-elements';
// import ListItem from '../components/ListItem';

export default class ActivityList extends Component {
  render() {
    const navigation = this.props.navigation;
    return (
      <ScrollView>
        <List containerStyle={{marginTop: 0}}>
          {this.props.data.map((l, i) => (
            <ListItem
              avatar={
                <Avatar
                  containerStyle={{borderRadius: 10}}
                  overlayContainerStyle={{borderRadius: 10}}
                  avatarStyle={{borderRadius: 10}}
                  width={120}
                  height={90}
                  source={{uri: l.favicon}}
                />
              }
              hideChevron={true}
              key={i}
              onPress={() => navigation.navigate('ActivityDetail', {activityId: l.activityId})}
              title={l.name}
              subtitle={l.notes}
            />
          ))}
        </List>
      </ScrollView>
    )
  }
}
