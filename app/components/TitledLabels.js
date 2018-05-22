import React, {Component} from "react";
import {StyleSheet, Dimensions, View, Text} from "react-native";
import {Button} from 'react-native-elements';
import colors from '../lib/colors';
import normalize from '../lib/normalizeText';


/**
 * @Author: weiwenda
 * @Description: 用于显示兴趣爱好
 * @Date: 下午7:18 2018/4/23
 */
class LabelsEditScreen extends Component {
  render() {
    return (
      <View>
        <Text style={styles.center}>{this.props.title}</Text>
        <View style={styles.buttonContainer}>
          {
            this.props.data.map(detail => {
              const selected = this.props.preset.find(label=>label===detail.name);
              return (
                <Button
                  key = {detail.key}
                  onPress={()=>this.props.onClick(detail.name)}
                  raised borderRadius={5}
                        containerViewStyle={styles.container}
                        buttonStyle={[styles.button,
                          {backgroundColor:selected?colors.primary1:colors.grey5}]}
                        textStyle={{fontSize:detail.name.length>4?normalize(12):normalize(16),
                          color:selected?'white':'black'}}
                        title={detail.name}/>
              );
            })
          }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  center: {textAlign: 'center', paddingTop: 15,},
  buttonContainer: {
    flexDirection: 'row', flexWrap: 'wrap',
  },
  container: {
    marginTop: 15, width: (Dimensions.get('window').width - 50) / 4, flexDirection: 'row',
    marginRight: 0, marginLeft: 10,
  },
  button: {padding: 5, flex: 1},
});

export default LabelsEditScreen;