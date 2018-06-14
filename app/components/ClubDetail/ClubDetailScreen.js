import React, {Component} from 'react';
import {Dimensions,ScrollView, View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import { List, Icon, Tile} from 'react-native-elements';
import {Fab, Button} from 'native-base';
import DetailPlane from './DetailPlane';
import TablelikeItem from '../TablelikeItem';
import {connect} from 'react-redux';
import  * as globalActions from '../../reducers/global/globalActions';
import {bindActionCreators} from "redux";

class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
  }
  render() {
    let data = this.props.navigation.state.params;
    // console.log(data);
    return (
      <View>
        <ScrollView>
          <Tile
            height={Dimensions.get('window').height*0.2}
            overlayContainerStyle={{paddingTop:10,paddingBottom:0}}
            titleStyle={{marginBottom:0}}
            captionStyle={{marginBottom:0}}
            imageSrc={{uri: data.favicon}}
            title={data.name}
            featured
            caption={(data.habits?data.habits.split(',').join('&')+'社团 ':' ')+'\nID:'+data.clubId}
          />
          <View style={{flexDirection: 'row', padding: 10}}>
            <View style={styles.flex1}>
              <Text>
                创建人：{data.chiefName}
              </Text>
            </View>
            <View style={styles.flex1}>
              <TouchableHighlight
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <Text>
                  当前共 11 名成员
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <List containerStyle={{marginTop: 0}}>
            <TablelikeItem title='宣言' content={<Text>{data.slogan} </Text>}/>
            <TablelikeItem title='简介' content={<Text>{data.introduction} </Text>}/>
            <TablelikeItem title='公告' content={<Text>{data.introduction} </Text>}/>
          </List>
          <View style={{height: 400}}>
            <DetailPlane
              navigation={this.props.navigation}
            />
          </View>
        </ScrollView>
        <Fab
          active={this.state.active}
          direction="up"
          style={{backgroundColor: '#5067FF'}}
          position="bottomRight"
          onPress={() => this.setState({active: !this.state.active})}>
          <Icon name="bars" color='white' type="font-awesome"/>
          <Button
            onPress={() =>
              this.props.navigation.navigate("ClubEdit",{data:{...data},
                action:(domain,content) =>
                this.props.navigation.setParams({[domain]:content})
              })}
            style={{backgroundColor: '#34A34F'}}>
            <Icon name="edit" type="feather" color='white'/>
          </Button>
          <Button
            onPress={()=>
              this.props.partActivity(this.props.user_id, this.state.activityId)}
            style={{backgroundColor: '#00a7f7'}}>
            <Icon name="share" type='feather' color='white'/>
          </Button>
          <Button
            onPress={()=>
              this.props.navigation.navigate("Home")}
            style={{backgroundColor: '#e4411e'}}>
            <Icon name="exit-to-app" type="material-community" color='white'/>
          </Button>
        </Fab>
      </View>
    );
  }
}

ActivityDetail.router = DetailPlane.router;

const styles = StyleSheet.create({
  flex1: {flex: 1, alignItems: 'center'},
});
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(globalActions, dispatch)
  }
};
const mapStateToProps = state => {
  return {
    user_id: state.global.currentUser.userId,
    toast: state.toast,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);