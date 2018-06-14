import React, {Component} from "react";
import {
  StyleSheet, TouchableOpacity,
  ScrollView, View, Image, Modal, Text, TextInput, Dimensions
} from 'react-native';
import {List, Icon, ListItem, Button} from 'react-native-elements';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import {imagePickerOptions} from '../MyScreen/UserDataScreen';
import colors from '../../lib/colors';
import moment from 'moment';
import'moment/locale/zh-cn';
moment.locale('zh-cn');
import normalize from '../../lib/normalizeText';
import {deepCopy, durationUnit} from "../../lib/helpFunctions";
import {connect} from "react-redux";
import * as globalActions from '../../reducers/global/globalActions';
import {RichTextEditor, RichTextToolbar} from '../../components/react-native-zss-rich-text-editor';
import actionTools from '../../lib/editorTools';
import {bindActionCreators} from "redux";

const privileges = ['好友可见', '俱乐部可见', '所有人可见'];

class ActivityAddScreen extends Component {

  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    // const {signOutButton} = "params" in state && state.params;
    const component = <TouchableOpacity onPress={() => {
    }}>
      <Text style={{
        marginRight: 10,
        fontSize: normalize(12),
        color: 'black'
      }}>草稿箱
      </Text></TouchableOpacity>;
    return {
      headerRight: component
    }
  };

  static _createDateData(maxdays) {
    let minute = [];
    for (let k = 0; k < 60; k++) {
      minute.push(`${k < 10 ? 0 : ''}${k}分`);
    }
    let hour = [];
    for (let j = 0; j < 24; j++) {
      hour.push({[`${j < 10 ? 0 : ''}${j}时`]: minute});
    }
    let date = [];
    let now = moment();
    date.push({'今天': hour});
    for (let i = 0; i < maxdays; i++) {
      date.push({[`${now.add(1, 'days').format('MMMDodddd')}`]: hour});
    }
    return date;
  }

  static _createDurationData(prefix, suffix) {
    let unitFinal = durationUnit.map(i => `${i}${suffix}`);
    let result = [];
    for (let j = 1; j < 60; j++) {
      result.push({[`${prefix}${j}`]: unitFinal});
    }
    return result;
  }

  static _createTypeData(clubs) {
    let types = privileges.slice(0);
    let clubsName = clubs.map(club => club.name);
    return types.map(type => {
      if (type !== '俱乐部可见')
        return {[type]: [type]};
      else
        return {[type]: clubsName}
    });
  }


  showDatePickerDropdown(preset, domain) {
    this._setModalVisible(true);
    const preset1 = preset.format('MMMDodddd') === moment().format('MMMDodddd') ? '今天' : preset.format('MMMDodddd');
    const preset2 = `${preset.hour() < 10 ? 0 : ''}${preset.hour()}时`;
    const preset3 = `${preset.minute() < 10 ? 0 : ''}${preset.minute()}分`;
    let data = ActivityAddScreen._createDateData(90);
    Picker.init({
      isLoop: true,
      pickerData: data,
      pickerTitleText: '选择时间',
      pickerConfirmBtnText: '确认',
      pickerCancelBtnText: '取消',
      selectedValue: [preset1, preset2, preset3],
      wheelFlex: [2, 1, 1],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        this._setModalVisible(false);
        let now = moment();
        now.add(pickedIndex[0], 'days');
        now.hour(pickedIndex[1]);
        now.minute(pickedIndex[2]);
        this.props.actions.addActivity(domain,
          now.format('YYYY-MM-DD HH:mm:ss'));
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
        this._setModalVisible(false);
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
        //do nothing
      }
    });
    Picker.show();
  }

  showDurationPickerDropdown(preset, domain, prefix, suffix = '') {
    this._setModalVisible(true);
    let data = ActivityAddScreen._createDurationData(prefix, suffix);
    Picker.init({
      // isLoop: true,
      pickerData: data,
      pickerTitleText: '选择时长',
      pickerConfirmBtnText: '确认',
      pickerCancelBtnText: '取消',
      selectedValue: preset.split(' '),
      onPickerConfirm: (pickedValue, pickedIndex) => {
        this._setModalVisible(false);
        this.props.actions.addActivity(domain, pickedValue.join(" "));
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
        this._setModalVisible(false);
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
        //do nothing
      }
    });
    Picker.show();
  }

  showTypePickerDropdown(privilege, domain, clubId = 0) {
    this._setModalVisible(true);
    let data = ActivityAddScreen._createTypeData(this.props.chiefClubs);
    let preset1 = privileges[privilege];
    let preset2 = clubId && privilege === 1 ?
      this.props.chiefClubs.find(club => club.clubId === clubId).name : preset1;
    Picker.init({
      // isLoop: true,
      pickerData: data,
      pickerTitleText: '选择活动类型',
      pickerConfirmBtnText: '确认',
      pickerCancelBtnText: '取消',
      selectedValue: [preset1, preset2],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        this._setModalVisible(false);
        if (pickedValue[0] === '俱乐部可见')
          this.props.actions.addActivity('clubId', this.props.chiefClubs[pickedIndex[1]].clubId);
        this.props.actions.addActivity(domain, pickedIndex[0]);
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
        this._setModalVisible(false);
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
        //do nothing
      }
    });
    Picker.show();
  }

  _setModalVisible(visible) {
    Picker.isPickerShow(status => {
      status && Picker.hide();
    });
    this.setState({modalVisible: visible});
  }

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
        this.props.actions.uploadImage(this.props.userId, response.uri,(uri)=>
          this.props.actions.addActivity('favicon',uri));
      }
    });
  }

  showImagePickerContent() {
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
        this.props.actions.uploadImage(this.props.organizerId, response.uri, (fileUrl) => {
          this._richtext.insertImage({src: fileUrl, width: Dimensions.get('window').width - 40});
        });
      }
    });
  }

  saveAll() {
    this._richtext.getTitleText().then((title) => {
      this._richtext.getContentHtml().then((content) => {
        this.props.actions.saveActivity({organizerId:this.props.userId,name: title, introduction: content});
      });
    });
    this.props.navigation.goBack();
  }

  _inputRef = undefined;
  _richtext = undefined;

  showClearIcon() {
    if (this.props.notes !== '')
      return (
        <Icon
          containerStyle={{flex: 0.1}}
          size={28}
          type='ionicon'
          name='ios-backspace-outline'
          color={colors.grey4}
          onPress={() => {
            this.props.actions.addActivity('notes', '');
            this._inputRef.setState({layoutHeight: 30});
          }}
        />
      );
  }

  onEditorInitialized() {
    this._richtext.registerContentChangeListener((content,height)=>{
      const compensation = 65;
      // console.log(content,height,this.state.initHeight);
      let re1 = /<div><br><img.*?><br><\/div>$/i;
      let re2 = /<br><img.*?><br>$/i;
      if((content.match(re2)|| content.match(re1))&&height<this.state.DPHeight ){
        this.setState({DPHeight: height+compensation+450})
      }else{
        if(height+compensation > this.state.initHeight)
          this.setState({DPHeight: height+compensation})
        else if(height+compensation <this.state.initHeight &&
          this.state.DPHeight !== this.state.initHeight
        )
          this.setState({DPHeight: this.state.initHeight})
      }
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      DPHeight: Dimensions.get('window').height / 2 - 40,
      initHeight:Dimensions.get('window').height / 2 - 40,
    }
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <View>
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
                              this._setModalVisible(false);
                            }}>
          </TouchableOpacity>
        </Modal>
        <ScrollView>
          <View style={[styles.rickContainer, {height: this.state.DPHeight}]}>
            <RichTextEditor
              enableOnChange
              scrollEnabled={false}
              ref={(r) => this._richtext = r}
              style={styles.richText}
              titlePlaceholder={'请输入活动主题'}
              contentPlaceholder={'活动详情，可详细介绍活动值得参加的特点，行程，注意事项等'}
              // initialTitleHTML={'Title!!'}
              // initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
              editorInitializedCallback={() => this.onEditorInitialized()}
            />
            <RichTextToolbar
              onPressAddImage={() => {
                this.showImagePickerContent()
              }}
              getEditor={() => this._richtext}
              actions={actionTools.actionsArray}
              iconMap={actionTools.tools}
              unselectedButtonStyle={{backgroundColor: colors.grey5, width: 40}}
              selectedButtonStyle={{backgroundColor: colors.yellow, width: 40}}
            />
          </View>
          <List containerStyle={{marginTop: 0}}>
            <ListItem title="活动类型"
                      rightTitle={`${privileges[this.props.privilege]}${this.props.privilege === 1 ?
                        '：' + this.props.chiefClubs.find(club => club.clubId === this.props.clubId).name :
                        ''}`}
                      onPress={() => {
                        Picker.isPickerShow(on => {
                            if (!on)
                              this.showTypePickerDropdown(
                                this.props.privilege,
                                'privilege',
                                this.props.clubId
                              );
                          }
                        );
                      }}
            />
            <ListItem title="活动开始" rightTitle={this.props.startTime}
                      onPress={() => {
                        Picker.isPickerShow(on => {
                            if (!on)
                              this.showDatePickerDropdown(
                                this.props.startTime !== '未设置' ? moment(this.props.startTime) : moment(),
                                'startTime'
                              );
                          }
                        );
                      }}
            />
            <ListItem title="报名截止" rightTitle={this.props.prepareTime}
                      onPress={() => {
                        Picker.isPickerShow(on => {
                            if (!on)
                              this.showDurationPickerDropdown(
                                this.props.prepareTime,
                                'prepareTime',
                                '提前',
                              );
                          }
                        );
                      }}
            />
            <ListItem title="活动结束" rightTitle={this.props.duration}
                      onPress={() => {
                        Picker.isPickerShow(on => {
                            if (!on)
                              this.showDurationPickerDropdown(
                                this.props.duration,
                                'duration',
                                '预计',
                                '后',
                              );
                          }
                        );
                      }}
            />
            <ListItem title="活动地点" rightTitle={this.props.address}
                      onPress={() =>
                        navigation.navigate('HomeMap', {
                          action: this.props.actions.addActivity,
                          domain: 'address',
                          title: "选择地点",
                          text: this.props.address,
                        })
                      }
            />
            <ListItem title="活动封面"
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
            <ListItem title="报名须知"
                      rightIcon={
                        <View style={[styles.row, {flex: 3}]}>
                          <TextInput style={styles.textInput}
                                     ref={ref => {
                                       this._inputRef = ref;
                                     }
                                     }
                                     autoGrow={true}
                                     multiline={true}
                                     underlineColorAndroid={'transparent'}
                                     onChange={event => {
                                       this.props.actions.addActivity('notes', event.nativeEvent.text)
                                     }
                                     }
                                     value={this.props.notes}
                                     placeholderTextColor={colors.grey4}
                                     placeholder={'输入(最多300字)'}/>
                          {this.showClearIcon()}
                        </View>
                      }/>
          </List>
          <Button
            onPress={() => {
              this.saveAll();
            }}
            borderRadius={5}
            containerViewStyle={styles.container}
            buttonStyle={styles.button}
            textStyle={{fontSize: normalize(16)}}
            title='直接发布'/>
          <Button
            onPress={() => {
              this.props.actions.saveActivity(this.props.uesrId);
              this.props.navigation.goBack();
            }}
            borderRadius={5}
            containerViewStyle={[styles.container, {marginBottom: 15}]}
            buttonStyle={styles.button}
            textStyle={{fontSize: normalize(16)}}
            title='保存草稿'/>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flex: 1.15},
  container: {marginTop: 15},
  button: {padding: 5, flex: 1, backgroundColor: colors.secondary2},
  textInput: {textAlign: 'right', padding: 10, flex: 1, height: 30},
  rickContainer: {
    backgroundColor: 'white', paddingTop: 15,
  },
  richText: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
});
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  let tmp = deepCopy(state.newActivityData);
  tmp['userId'] = state.global.currentUser.userId;
  tmp['chiefClubs'] = deepCopy(state.global.chiefClubs);
  return tmp;
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityAddScreen);