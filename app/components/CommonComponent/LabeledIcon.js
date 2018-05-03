import React, { Component } from "react";

import { StyleSheet, TouchableOpacity } from "react-native";

import {
  registerCustomIconType,
  Text,
  Icon
} from 'react-native-elements';

class LabeledIcon extends Component {
  render() {
    const color=this.props.white?'white':'black';
    return (
      <TouchableOpacity
        style ={styles.container}
        onPress={() => this.props.navigation.navigate(this.props.jumpTo)}
      >
        <Icon
          color={color}
          type={this.props.type}
          name={this.props.ion}
          size={30}
        />
        <Text style={[styles.center,{color:color}]}>
          {this.props.label}
        </Text>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex:1,flexDirection:'column' },
  center:{textAlign:'center',marginTop:5}
});


export default LabeledIcon;
