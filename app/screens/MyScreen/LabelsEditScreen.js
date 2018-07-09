import React, {Component} from "react";
import {StyleSheet, ScrollView, View, Text, TouchableOpacity} from "react-native";
import colors from '../../lib/colors';
import normalize from '../../lib/normalizeText';
import TitledLabels from '../../components/TitledLabels';
import BottomText from '../../components/BottomText';
import {Button} from 'react-native-elements';
import {addLabel} from '../../reducers/global/globalActions';
import {connect} from "react-redux";
import {deepCopy} from "../../lib/helpFunctions";


class LabelsEditScreen extends Component {
  static navigationOptions = ({navigation}) => {

    const {state} = navigation;
    const {signOutButton, modified} = "params" in state && state.params;
    const component = modified ? <TouchableOpacity onPress={signOutButton}>
      <Text style={{
        marginRight: 10,
        fontSize: normalize(16),
        color: colors.primary1
      }}>保存
      </Text></TouchableOpacity> : <View/>;
    return {
      headerRight: component
    }
  };

  constructor(props) {
    super(props);
    const preset = props.navigation.state.params.preset;
    let labels = preset && preset !== undefined ? preset.split(',') : [];
    this.state = {
      oldLabels: labels,
      newLabels: [...labels],
    };
  }

  componentWillMount() {

    const signOutButton = () => {
      let params = this.props.navigation.state.params;
      if('userId' in params)
        params.action(params.userId,params.domain, this.state.newLabels.join(','));
      else
        params.action(params.domain, this.state.newLabels.join(','));
      this.props.navigation.goBack();
    };
    this.props.navigation.setParams({signOutButton: signOutButton})
  }

  _onClick = key => {
    const index = this.state.newLabels.findIndex((label, index) => label === key);
    if (index !== -1) {
      this.state.newLabels.splice(index, 1);
    } else {
      this.state.newLabels.push(key);
    }
    if (this.state.newLabels.slice(0).sort().join(',') !== this.state.oldLabels.sort().join(',')) {
      this.props.navigation.setParams({modified: true})
    } else {
      this.props.navigation.setParams({modified: false})
    }
  };

  _mkListViews() {
    const params = this.props.navigation.state.params;
    let data = params.domain === 'labels' ? this.props.labels : this.props.habits;
    return data.map(bigtype => {
      return (
        <TitledLabels
          key={bigtype.key}
          onClick={this._onClick}
          preset={this.state.newLabels}
          title={bigtype.name}
          data={bigtype.details}/>
      );
    });
  }

  _mkAddButton() {
    const params = this.props.navigation.state.params;
    if (params.domain === 'labels') {
      return (
        <Button
          onPress={() =>
            this.props.navigation.navigate('TextEdit', {
              action: this.props.addLabel,
              domain: 0,
              title: "添加标签",
              placeholder: '输入符合我的标签',
            })}
          borderRadius={5}
          containerViewStyle={styles.container}
          buttonStyle={styles.button}
          textStyle={{color: 'black'}}
          icon={{name: 'circle-with-plus', type: 'entypo', color: 'green'}} title={'创建新标签'}
        />
      )
    }
  }

  render() {
    return (
      <ScrollView style={styles.whiteBackground}>
        {this._mkAddButton()}
        {this._mkListViews()}
        <BottomText >已经到底了</BottomText>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  whiteBackground: {backgroundColor: 'white'},
  container: {
    marginTop: 15, marginRight: 10, marginLeft: 10,
  },
  button: {padding: 5, flex: 1, backgroundColor: colors.grey5},
});
const mapDispatchToProps = (dispatch) => {
  return {
    addLabel: (domain, content) => {
      dispatch(addLabel(domain, content));
    },
  };
};
const mapStateToProps = state => {
  return deepCopy(state.publicData);
  // return state.userdata;
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelsEditScreen);