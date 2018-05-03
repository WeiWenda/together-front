import React, {Component} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {Card, List, Icon} from 'react-native-elements';
import {Fab, Button, Container, Toast} from 'native-base';
import {server} from '../config/urls';
import DetailPlane from './DetailPlane';
import TablelikeItem from '../CommonComponent/TablelikeItem';
import moment from 'moment';
import colors from '../config/colors';
import {connect} from 'react-redux';
import {partActivity} from '../../actions/creators';


class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      DPHeight:0,
    }
  }

  componentDidMount() {
    fetch(`${server}activity/detail?id=${this.props.navigation.state.params.activityId}`)
      .then((response) => response.json())
      .then(obj => {
        console.log(obj.data);
        this.setState({...obj.data});
      });
  }

  componentWillUpdate() {
    // if(this.props.toast)
    // Toast.show({
    //   text: this.props.toast,
    //   position: 'bottom',
    //   buttonText: 'Okay'
    // })
  }
  onMessage = (event) =>{
    try {
      const action = JSON.parse(event.nativeEvent.data)
      if (action.type === 'setHeight' && action.height > 0) {
        this.setState({ DPHeight: action.height+50 })
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
              this.props.partActivity(this.props.user_id, this.state.activityId);
              // this.props.navigation.goBack();
            }}
            style={{backgroundColor: '#34A34F'}}>
            <Icon name="plus" type="font-awesome" color='white'/>
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
    partActivity: (uid, aid) => {
      dispatch(partActivity(uid, aid));
    },
  };
};
const mapStateToProps = state => {
  return {
    user_id: state.userdata.user_id,
    toast: state.toast,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);