import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, ScrollView, View, Image, Modal} from 'react-native';
import {List, Icon, ListItem,Button} from 'react-native-elements';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import {imagePickerOptions} from '../MyScreen/UserDataScreen';
import colors from '../../lib/colors';
import normalize from '../../lib/normalizeText';
import {connect} from "react-redux";
import {updateClub,uploadImage} from '../../actions/creators';
import {contentEq} from "../../lib/helpFunctions";

class ClubEditScreen extends Component {
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
        this.props.uploadImage('favicon', response.uri,this.updateLocal);
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data:{...props.navigation.state.params.data}
    }
  }
  updateLocal=(domain,content)=>{
    let tmp = this.state.data;
    tmp[domain]=content;
    let params = this.props.navigation.state.params;
    params.action(domain,content);
    this.setState({
      data:tmp
    });
  }

  render() {
    const navigation = this.props.navigation;
    let data = this.state.data;
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
                                data.favicon ? {uri: data.favicon} :
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
            <ListItem title="俱乐部名称" rightTitle={data.name}
                      onPress={() =>
                        navigation.navigate('HomeTextEdit', {
                          action: this.updateLocal,
                          domain: 'name',
                          title: "编辑名称",
                          text: data.name,
                        })
                      }
            />
            <ListItem title="宣言" rightTitle={data.slogan}
                      onPress={() =>
                        navigation.navigate('HomeTextEdit', {
                          action: this.updateLocal,
                          domain: 'slogan',
                          title: "编辑宣言",
                          text: data.slogan,
                        })
                      }
            />
            <ListItem title="简介" rightTitle={data.introduction}
                      onPress={() =>
                        navigation.navigate('HomeTextEdit', {
                          action: this.updateLocal,
                          domain: 'introduction',
                          title: "编辑简介",
                          text: data.introduction,
                        })
                      }
            />
            <ListItem title="主打项目" rightTitle={data.habits}
                      onPress={() =>
                        navigation.navigate('HomeLabelsEdit', {
                          action: this.updateLocal,
                          domain: 'habits',
                          title: "编辑主打项目",
                          preset: data.habits,
                        })
                      }
            />
          </List>
          <List>
            <ListItem title="负责人" textInput
                      hideChevron={!data.chiefName}
                      onPressRightIcon={()=>this.updateLocal('chiefName','')}
                      rightIcon={{type:'ionicon',name:'ios-backspace-outline'}}
                      textInputValue={data.chiefName}
                      textInputStyle={{height:null,padding:0}}
                      textInputContainerStyle={{paddingRight:10}}
                      textInputPlaceholder='输入'
                      textInputOnChangeText={text=>this.updateLocal('chiefName',text)}
                      textInputMaxLength={5} />
            <ListItem title="电话" textInput
                      hideChevron={!data.callnumber}
                      onPressRightIcon={()=>this.updateLocal('callnumber','')}
                      rightIcon={{type:'ionicon',name:'ios-backspace-outline'}}
                      keyboardType='numeric'
                      textInputValue={data.callnumber}
                      textInputStyle={{height:null,padding:0}}
                      textInputContainerStyle={{paddingRight:10}}
                      textInputPlaceholder='输入'
                      textInputOnChangeText={text=>this.updateLocal('callnumber',text)}
                      textInputMaxLength={11} />
          </List>
          <Button
            onPress={()=>{
              this.props.updateClub(this.state.data,this.props.navigation.state.params);
              this.props.navigation.goBack();
            }}
            borderRadius={5}
            containerViewStyle={styles.container}
            buttonStyle={styles.button}
            textStyle={{fontSize:normalize(16)}}
            title='保存修改'/>
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
    uploadImage:(domain,content,callback)=>{
      dispatch(uploadImage(domain,content,callback));
    },
    updateClub:(data,oldData)=>{
      if(!contentEq(data,oldData))
        dispatch(updateClub(data));
    },
  };
};
const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubEditScreen);