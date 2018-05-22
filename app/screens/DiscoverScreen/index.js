import {createStackNavigator, StackNavigator} from 'react-navigation';
import ClubScreen from "./ClubScreen";
import ClubDetailScreen from "../../components/ClubDetail/ClubDetailScreen";

const HomeScreen = createStackNavigator({
  Club: {
    screen: ClubScreen,
    navigationOptions: {
      title: '发现',
      headerTitleStyle: {
        alignSelf: 'center',
      }
    },
  },
  ClubDetail:{
    screen: ClubDetailScreen,
    navigationOptions: {
      title: '俱乐部详情',
      headerTitleStyle: {
        alignSelf: 'center',
      }
    },
  },
});
export default HomeScreen;