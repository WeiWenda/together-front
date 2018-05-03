import React, {Component} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {Card, List, Icon} from 'react-native-elements';
import {Fab, Button, Container, Toast} from 'native-base';
import DetailPlane from './DetailPlane';
import TablelikeItem from '../CommonComponent/TablelikeItem';
import colors from '../config/colors';
import {connect} from 'react-redux';
import {partActivity} from '../../actions/creators';

class ActivityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
  }
  //俱乐部数据，在navigation.state.params中传入
  // componentDidMount() {
  //   fetch(`${server}activity/detail?id=${this.props.navigation.state.params.activityId}`)
  //     .then((response) => response.json())
  //     .then(obj => {
  //       console.log(obj.data);
  //       this.setState({...obj.data});
  //     });
  // }

  // componentWillUpdate() {
  //   if(this.props.toast)
  //   Toast.show({
  //     text: this.props.toast,
  //     position: 'bottom',
  //     buttonText: 'Okay'
  //   })
  // }

  render() {
    data = this.props.navigation.state.params;
    return (
      <Container>
        <ScrollView>
          <Card
            containerStyle={{padding: 0, margin: 10}}
            wrapperStyle={{padding: 0}}
            image={{uri: data.favicon}}>
            <View style={{flexDirection: 'row'}}>
              <Text>
                {data.name}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.flex1}>
                <Text>
                 {data.chiefName}
                </Text>
              </View>
              <View style={styles.flex1}>
                <Text>
                  成员个数
                </Text>
              </View>
              <View style={styles.flex1}>
                <Text>
                  活动个数
                </Text>
              </View>
            </View>
            <List>
              <TablelikeItem title='宣言' content={<Text>{data.slogan} </Text>}/>
              <TablelikeItem title='简介' content={<Text>{data.introdocution} </Text>}/>
              <TablelikeItem title='公告' content={<Text>{data.introdocution} </Text>}/>
            </List>
            <View style={{height: 400, borderTopColor: colors.greyOutline, borderTopWidth: 1}}>
              <DetailPlane
                navigation={this.props.navigation}
                />
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
          <Icon name="bars" color='white' type="font-awesome"  />
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
  flex1: {flex: 1},
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