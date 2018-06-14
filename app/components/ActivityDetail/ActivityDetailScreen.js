import React, {Component} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {Card, List, Icon} from 'react-native-elements';
import {Fab, Button, Container, Toast,Root} from 'native-base';
import {server} from '../../lib/urls';
import DetailPlane from './DetailPlane';
import TablelikeItem from '../TablelikeItem';
import moment from 'moment';
import colors from '../../lib/colors';
import {connect} from 'react-redux';
import  * as globalActions from '../../reducers/global/globalActions';
import {bindActionCreators} from "redux";


class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      DPHeight:40,
    }
  }

  componentDidMount() {
    fetch(`${server}/activity/detail?id=${this.props.navigation.state.params.activityId}`)
      .then((response) => response.json())
      .then(obj => {
        console.log(obj.data);
        this.setState({...obj.data});
      });
  }
  onMessage = (event) =>{
    try {
      const action = JSON.parse(event.nativeEvent.data)
      if (action.type === 'setHeight' && action.height > 0 &&action.height<3000) {
        console.log(action.height);
        this.setState({ DPHeight: action.height+40})
      }
    } catch (error) {
      // pass
    }
  }

  render() {
    return (
      <Container>
        <ScrollView>
          <Card
            containerStyle={{padding: 0, margin: 10,marginBottom:10}}
            wrapperStyle={{padding: 0}}
            image={{uri: this.state.favicon}}
            featuredTitle={this.state.name}
          >
            <View style={{flexDirection: 'row', alignItems: 'center',paddingVertical:10}}>
              <View style={{flex:2,borderRightColor:colors.greyOutline,borderRightWidth:1,alignItems:'center'}}>
                <Text>
                  组织者：{this.state.organizerName}
                </Text>
              </View>
              <View style={{flexDirection: 'row',flex:1}}>
                <View style={styles.flex1}>
                  <Text>
                    {this.state.readcount}阅读
                  </Text>
                </View>
                <View style={styles.flex1}>
                  <Text>
                    {this.state.readcount}分享
                  </Text>
                </View>
              </View>
            </View>
            <List containerStyle={{marginTop:0}}>
              <TablelikeItem title='地点' content={<Text>{this.state.address} </Text>}/>
              <TablelikeItem title='时间'
                             content={
                               <Text>
                                 {moment(this.state.startTime).format('YYYY-MM-DD HH:mm:ss')}
                               </Text>}/>
              <TablelikeItem title='主办方'
                             content={
                               <Text>{this.state.clubName} </Text>
                             }/>
              <TablelikeItem title='已报名'
                             content={
                               <Text>{this.state.partcount} </Text>}/>
            </List>
            <View style={{height:this.state.DPHeight}}>
              <DetailPlane
                navigation={this.props.navigation}
                screenProps={{
                  photos: this.state.clubId,
                  introduction: this.state.introduction,
                  onMessage:this.onMessage,
                }}/>
            </View>
          </Card>

        </ScrollView>

        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          style={{backgroundColor: '#5067FF'}}
          position="bottomRight"
          onPress={() => this.setState({active: !this.state.active})}>
          <Icon name="bars" color='white' type="font-awesome"/>
          <Button
            onPress={() => {
              this.props.actions.partActivity(this.props.userId, this.state.activityId);
              this.props.navigation.goBack();
            }}
            style={{backgroundColor: '#34A34F'}}>
            <Icon name="plus" type="font-awesome" color='white'/>
          </Button>
          <Button onPress={()=>{
            this.props.actions.removeActivity(this.props.userId,this.state.activityId);
            this.props.navigation.popToTop();
          }} style={{backgroundColor: '#ca6655'}}>
            <Icon name="trash-o" type="font-awesome" color="white"/>
          </Button>
          <Button style={{backgroundColor: '#3B5998'}}>
            <Icon name="star-o" type="font-awesome" color='white'/>
          </Button>
          <Button style={{backgroundColor: '#DD5144'}}>
            <Icon name="external-link" type='font-awesome' color='white'/>
          </Button>
        </Fab>
      </Container>
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
    userId: state.global.currentUser.userId,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);