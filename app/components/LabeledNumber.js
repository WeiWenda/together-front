import React, { Component } from "react";

import { StyleSheet, TouchableOpacity } from "react-native";

import {
  registerCustomIconType,
  Text,
  Button,
  Icon,
  SocialIcon,
  Card
} from 'react-native-elements';

class LabeledNumber extends Component {
  render() {
    return (
      <TouchableOpacity
        style ={styles.container}
        onPress={() => this.props.navigation.navigate('DiscoverTab')}
      >
        <Text style={styles.center}>
          {this.props.label}
        </Text>
        <Text h4 style={[styles.center,{marginTop:10}]}>
          {this.props.num}
        </Text>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex:1,flexDirection:'column' },
  center:{textAlign:'center'}
});


export default LabeledNumber;
