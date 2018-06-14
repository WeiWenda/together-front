import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, ScrollView, View, Image, Modal} from 'react-native';
import {List, Icon, ListItem,Button} from 'react-native-elements';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import {imagePickerOptions} from '../MyScreen/UserDataScreen';
import colors from '../../lib/colors';
import normalize from '../../lib/normalizeText';
import {deepCopy} from "../../lib/helpFunctions";
import {connect} from "react-redux";
import * as globalActions from '../../reducers/global/globalActions';
import {bindActionCreators} from "redux";

class ClubAddScreen extends Component {
  showImagePicker() {
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        //donothing
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        //donothing
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.props.actions.uploadImage(this.props.userId,response.uri,
          (uri)=>this.props.actions.addClub('favicon',uri));
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    }
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={{ flex: 1}}>
        <Modal
          animationType='fade'
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this._setModalVisible(false)
          }}
        >
          <TouchableOpacity style={{flex: 1, backgroundColor: 'black', opacity: 0.5}}
                            activeOpacity={0.5}
                            onPress={() => {
                              Picker.hide();
                              this._setModalVisible(false);
                            }}>
          </TouchableOpacity>
        </Modal>
        <ScrollView>
          <List>
            <ListItem title="俱乐部Logo"
                      onPress={() =>
                        this.showImagePicker()
                      }
                      rightIcon={
                        <View style={styles.row}>
                          <View style={{flex: 1, alignItems: 'flex-end'}}>
                            <Image
                              style={{borderRadius: 10, width: 50, height: 50}}
                              source={
                                this.props.favicon ? {uri: this.props.favicon} :
                                  require('../../lib/NavLogo.png')
                              }
                            />
                          </View>
                          <Icon
                            containerStyle={{flex: 0.15}}
                            size={28}
                            name='chevron-right'
                            color={colors.grey4}
                          />
                        </View>
                      }
            />
            <ListItem title="俱乐部名称" rightTitle={this.props.name}
                      onPress={() =>
                        navigation.navigate('HomeTextEdit', {
                          action: this.props.actions.addClub,
                          domain: 'name',
                          title: "编辑名称",
                          text: this.props.name,
                        })
                      }
            />
            <ListItem title="宣言" rightTitle={this.props.slogan}
                      onPress={() =>
                        navigation.navigate('HomeTextEdit', {
                          action: this.props.actions.addClub,
                          domain: 'slogan',
                          title: "编辑宣言",
                          text: this.props.slogan,
                        })
                      }
            />
            <ListItem title="简介" rightTitle={this.props.introduction}
                      onPress={() =>
                        navigation.navigate('HomeTextEdit', {
                          action: this.props.actions.addClub,
                          domain: 'introduction',
                          title: "编辑简介",
                          text: this.props.introduction,
                        })
                      }
            />
            <ListItem title="主打项目" rightTitle={this.props.habits}
                      onPress={() =>
                        navigation.navigate('HomeLabelsEdit', {
                          action: this.props.actions.addClub,
                          domain: 'habits',
                          title: "编辑主打项目",
                          preset: this.props.habits,
                        })
                      }
            />
          </List>
          <List>
            <ListItem title="负责人" textInput
                      hideChevron={!this.props.chiefName}
                      onPressRightIcon={()=>this.props.actions.addClub('chiefName','')}
                      rightIcon={{type:'ionicon',name:'ios-backspace-outline'}}
                      textInputValue={this.props.chiefName}
                      textInputStyle={{height:null,padding:0}}
                      textInputContainerStyle={{paddingRight:10}}
                      textInputPlaceholder='输入'
                      textInputOnChangeText={text=>this.props.actions.addClub('chiefName',text)}
                      textInputMaxLength={5} />
            <ListItem title="电话" textInput
                      hideChevron={!this.props.callnumber}
                      onPressRightIcon={()=>this.props.actions.addClub('callnumber','')}
                      rightIcon={{type:'ionicon',name:'ios-backspace-outline'}}
                      keyboardType='numeric'
                      textInputValue={this.props.callnumber}
                      textInputStyle={{height:null,padding:0}}
                      textInputContainerStyle={{paddingRight:10}}
                      textInputPlaceholder='输入'
                      textInputOnChangeText={text=>this.props.actions.addClub('callnumber',text)}
                      textInputMaxLength={11} />
          </List>
          <Button
            onPress={()=>{
              this.props.actions.saveClub(this.props.userId);
              this.props.navigation.goBack();
            }}
            borderRadius={5}
            containerViewStyle={styles.container}
            buttonStyle={styles.button}
            textStyle={{fontSize:normalize(16)}}
            title='提交审核'/>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  row: {flexDirection: 'row', flex: 1.15},
  container: {margin: 15},
  button: {padding: 5, flex: 1,backgroundColor:colors.secondary2},
});
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  let tmp = deepCopy(state.newClubData);
  tmp['userId'] = state.global.currentUser.userId;
  return tmp;
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubAddScreen);