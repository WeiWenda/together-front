import React, {Component} from "react";
import {View } from "react-native";
import {FormInput, SearchBar} from 'react-native-elements';


class TextEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text:props.navigation.state.params.text
    };
  }
  onSubmit = ev =>{
    let params = this.props.navigation.state.params;
    if('userId' in params)
      params.action(params.userId,params.domain,ev.nativeEvent.text);
    else
      params.action(params.domain,ev.nativeEvent.text);
    this.props.navigation.goBack();
  };
  render() {
    let params = this.props.navigation.state.params;
    return (
        <SearchBar
          clearIcon
          noIcon
          lightTheme
          autoFocus
          placeholder = {params.placeholder}
          value = {this.state.text}
          onSubmitEditing={this.onSubmit}
        />
    );
  }
}

export default TextEditScreen;