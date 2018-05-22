import React, {Component} from "react";
import colors from './colors';
import { Icon} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {actions} from '../../node_modules/react-native-zss-rich-text-editor/src/const';

export default {
  tools : {
    [actions.insertImage]: <Icon
      size={28}
      name='insert-photo'
      type='material'
      color={colors.grey0}
    />,
    [actions.insertLink]: <Icon
      size={28}
      name='insert-link'
      type='material'
      color={colors.grey0}
    />,
    [actions.setItalic]: <Icon
      size={28}
      name='format-italic'
      type='material'
      color={colors.grey0}
    />,
    [actions.insertBulletsList]: <Icon
      size={28}
      name='format-list-bulleted'
      type='material'
      color={colors.grey0}
    />,
    [actions.heading1]: <MaterialCommunityIcons
      size={28}
      name='format-header-1'
      color={colors.grey0}
      style={{alignSelf:'center'}}
    />
    , [actions.heading2]:<MaterialCommunityIcons
      size={28}
      name='format-header-2'
      color={colors.grey0}
      style={{alignSelf:'center'}}
    />
    , [actions.alignLeft]: <Icon
      size={28}
      name='format-align-left'
      type='material'
      color={colors.grey0}
    />
    , [actions.alignCenter]: <Icon
      size={28}
      name='format-align-center'
      type='material'
      color={colors.grey0}
    />, [actions.alignRight]: <Icon
      size={28}
      name='format-align-right'
      type='material'
      color={colors.grey0}
    />,
  },
  actionsArray:[
    actions.insertImage,
    actions.insertLink,
    actions.heading1,
    actions.heading2,
    actions.setItalic,
    actions.insertBulletsList,
    actions.alignLeft,
    actions.alignCenter,
    actions.alignRight,
  ]
};