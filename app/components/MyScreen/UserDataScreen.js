import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, ScrollView, View, Image, DatePickerAndroid, Modal} from 'react-native';
import {List, Icon, ListItem, ButtonGroup} from 'react-native-elements';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import BottomText from '../CommonComponent/BottomText';
import colors from '../config/colors';
import areas from '../../assets/chinese';
import {connect} from "react-redux";
import {editUser,uploadImage} from '../../actions/creators';
import moment from "moment";

const sexButtons = ['男', '女'];
export const imagePickerOptions= {
  title: '选择照片',
  cancelButtonTitle: '取消',
  chooseFromLibraryButtonTitle: '从手机相册选择',
  takePhotoButtonTitle: '拍照',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    }
  }

  async showPicker(preset) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        minDate: new Date(1900, 1, 1),
        maxDate: new Date(),
        date: preset
      });
      if (action === DatePickerAndroid.dismissedAction) {
        //do nothing
      } else {
        this.props.editDomain('birthday', moment({y: year, M: month, d: day}).format());
      }
    } catch ({code, message}) {
      console.warn(message);
    }
  }

  _createDateData(minYear, maxYear) {
    let month = [];
    for (let j = 1; j < 13; j++) {
      let day = [];
      if (j === 2) {
        for (let k = 1; k < 29; k++) {
          day.push(k + '日');
        }
      }
      else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
        for (let k = 1; k < 32; k++) {
          day.push(k + '日');
        }
      }
      else {
        for (let k = 1; k < 31; k++) {
          day.push(k + '日');
        }
      }
      month.push({[j + '月']: day});
    }
    let month2 = month.concat();
    month2[1]['2月'].push('29日');
    let date = [];
    for (let i = minYear; i <= maxYear; i++) {
      if (i % 4 === 0) {
        date.push({[i + '年']: month2});
      } else {
        date.push({[i + '年']: month});
      }
    }
    return date;
  }

  showDatePickerDropdown(preset) {
    this._setModalVisible(true);
    let data = this._createDateData(1900, moment(new Date()).year());
    Picker.init({
      pickerData: data,
      pickerTitleText: '选择出生日期',
      pickerConfirmBtnText: '确认',
      pickerCancelBtnText: '取消',
      selectedValue: [preset.year() + '年', (preset.month() + 1) + '月', preset.date() + '日'],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        this._setModalVisible(false);
        this.props.editDomain('birthday',
          moment({y: 1900 + pickedIndex[0], M: pickedIndex[1], d: pickedIndex[2] + 1})
            .format('YYYY-MM-DD'));
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

  showAreaPickerDropdown(preset) {
    this._setModalVisible(true);
    let data = areas.map(province => {
        return ({
          [province.name]: province.city.map(city => {
            return ({[city.name]: city.area});
          })
        });
      }
    );
    Picker.init({
      pickerTitleText: '选择城市',
      pickerConfirmBtnText: '确认',
      pickerCancelBtnText: '取消',
      pickerData: data,
      selectedValue: preset.split('/'),
      onPickerConfirm: data => {
        this._setModalVisible(false);
        this.props.editDomain('address', data.join('/'));
      },
      onPickerCancel: data => {
        this._setModalVisible(false);
      },
      onPickerSelect: data => {
        //donothing
      }
    });
    Picker.show();
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
        // this.props.editDomain('favicon',response.uri);
        this.props.uploadImage('favicon', response.uri,editUser);
      }
    });

  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    const {navigation} = this.props;
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
                              Picker.hide();
                              this._setModalVisible(false);
                            }}>
          </TouchableOpacity>
        </Modal>
        <ScrollView>
          <List>
            <ListItem title="头像"
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
                                  require('../../assets/NavLogo.png')
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
            <ListItem title="昵称" rightTitle={this.props.name}
                      onPress={() =>
                        navigation.navigate('TextEdit', {
                          action: this.props.editDomain,
                          domain: 'name',
                          title: "修改昵称",
                          text: this.props.name,
                        })
                      }
            />
            <ListItem title="二维码" rightIcon={
              <View style={styles.row}>
                <Icon
                  color={colors.grey4}
                  containerStyle={{flex: 1, alignItems: 'flex-end', marginRight: 10}}
                  name="qrcode-scan" type="material-community"
                />
                <Icon
                  containerStyle={{flex: 0.15}}
                  size={28}
                  name='chevron-right'
                  color={colors.grey4}
                />
              </View>
            }/>
            <ListItem title="个性签名" rightTitle={this.props.signature}
                      onPress={() =>
                        navigation.navigate('TextEdit', {
                          action: this.props.editDomain,
                          domain: 'signature',
                          title: "修改签名",
                          text: this.props.signature,
                        })
                      }
            />
          </List>
          <List>
            <ListItem title="所在城市" rightTitle={this.props.address}
                      onPress={() => {
                        Picker.isPickerShow(on => {
                            if (!on)
                              this.showAreaPickerDropdown(this.props.address);
                          }
                        );
                      } }/>
            <ListItem title="性别" rightIcon={
              <ButtonGroup
                containerStyle={{flex: 0.5, marginRight: 0,}}
                onPress={(selectedIndex) => {
                  this.props.editDomain('sex', selectedIndex)
                }}
                selectedIndex={this.props.sex}
                buttons={sexButtons}/>
            }/>
            <ListItem title="年龄" rightTitle={moment().diff(moment(this.props.birthday), 'years').toString()}
                      onPress={() => {
                        Picker.isPickerShow(on => {
                            if (!on)
                              this.showDatePickerDropdown(moment(this.props.birthday));
                          }
                        );
                      } }
            />
          </List>
          <List>
            <ListItem title="标签" rightTitle={this.props.labels}
                      onPress={() =>
                        navigation.navigate('LabelsEdit', {
                          action: this.props.editDomain,
                          domain: 'labels',
                          title: "编辑标签",
                          preset: this.props.labels,
                        })
                      }
            />
            <ListItem title="兴趣" rightTitle={this.props.habits}
                      onPress={() =>
                        navigation.navigate('LabelsEdit', {
                          action: this.props.editDomain,
                          domain: 'habits',
                          title: "编辑爱好",
                          preset: this.props.habits,
                        })
                      }
            />
          </List>
          <BottomText >已经到底了</BottomText>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  row: {flexDirection: 'row', flex: 1.15},
});
const mapDispatchToProps = (dispatch) => {
  return {
    editDomain: (domain, content) => {
        dispatch(editUser(domain, content));
    },
    uploadImage: (domain, uri,callback) => {
        dispatch(uploadImage(domain, uri,callback));
    },
  };
};

const mapStateToProps = state => {
  return {...state.userdata};
  // return state.userdata;
};
const ProfileScreenWrapped = connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

export default ProfileScreenWrapped;

