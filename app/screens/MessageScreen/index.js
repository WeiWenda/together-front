import {createStackNavigator} from "react-navigation";
import ChatRoomScreen from './ChatRoom';
import SessionListScreen from './SessionList';

const MessageScreen = createStackNavigator({
  SessionList: {
    screen: SessionListScreen,
    navigationOptions: {
      title: '会话',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  ChatRoom:{
    screen: ChatRoomScreen,
    navigationOptions:  ({navigation})=>({
      title: `${navigation.state.params.name}`,
      headerTitleStyle: {
        alignSelf: 'center',
      }
    }),
  }
});
export default MessageScreen;