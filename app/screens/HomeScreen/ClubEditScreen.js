import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, ScrollView, View, Image, Modal} from 'react-native';
import {List, Icon, ListItem,Button} from 'react-native-elements';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import {imagePickerOptions} from '../MyScreen/UserDataScreen';
import colors from '../../lib/colors';
import normalize from '../../lib/normalizeText';
import {connect} from "react-redux";
import  * as globalActions from '../../reducers/global/globalActions';
import {bindActionCreators} from "redux";
import {contentEq} from "../../lib/helpFunctions";
import {HeaderButtons}from "../../components/HeaderButtons";

class ClubEditScreen extends Component {

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    const {deleteAction} = "params" in state && state.params;
    const component = <HeaderButtons>
      <HeaderButtons.Item
        title='删除'
        onPress={deleteAction}
      />
    </HeaderButtons>;
    return {
      headerRight: component
    }
  };

  showImagePicker() {
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.props.actions.uploadImage(this.props.userId,response.uri,
          (uri)=>this.updateLocal('favicon',uri));
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
  componentWillMount() {
    this.props.navigation.setParams({deleteAction:()=>{
      this.props.actions.removeClub(this.props.userId,this.state.data.clubId)
      this.props.navigation.popToTop();
    }})
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
              if(!contentEq(this.state.data,this.props.navigation.state.params)){
                this.props.actions.updateClub(this.props.userId,this.state.data);
              }
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
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  return {userId:state.global.currentUser.userId};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubEditScreen);