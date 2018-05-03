import React from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  Switch,
  TextInput,
} from 'react-native';
import {Avatar, Badge, Icon, Text,} from 'react-native-elements';

import colors from '../config/colors';
import fonts from '../config/fonts';
import normalize from '../functions/normalizeText';


const ListItem = props => {
  const {
    onPress,
    title,
    leftIcon,
    rightIcon,
    leftIconOnPress,
    leftIconOnLongPress,
    leftIconUnderlayColor,
    leftIconContainerStyle,
    avatarStyle,
    avatarContainerStyle,
    avatarOverlayContainerStyle,
    underlayColor,
    subtitle,
    subtitleStyle,
    containerStyle,
    wrapperStyle,
    titleNumberOfLines,
    titleStyle,
    titleSubtitleContainerStyle,
    titleContainerStyle,
    hideChevron,
    chevronColor,
    roundAvatar,
    component,
    fontFamily,
    rightTitle,
    rightTitleContainerStyle,
    rightTitleStyle,
    rightTitleNumberOfLines,
    subtitleContainerStyle,
    subtitleNumberOfLines,
    badge,
    label,
    onLongPress,
    switchButton,
    onSwitch,
    switchDisabled,
    switchOnTintColor,
    switchThumbTintColor,
    switchTintColor,
    switched,
    textInput,
    textInputAutoCapitalize,
    textInputAutoCorrect,
    textInputAutoFocus,
    textInputEditable,
    keyboardType,
    textInputMaxLength,
    textInputMultiline,
    textInputOnChangeText,
    textInputOnFocus,
    textInputOnBlur,
    textInputSelectTextOnFocus,
    textInputReturnKeyType,
    textInputValue,
    textInputSecure,
    textInputStyle,
    textInputContainerStyle,
    textInputPlaceholder,
    onPressRightIcon,
    ...attributes
  } = props;

  let {avatar} = props;

  let Component = onPress || onLongPress ? TouchableHighlight : View;
  let LeftIconWrapper =
    leftIconOnPress || leftIconOnLongPress ? TouchableHighlight : View;
  if (component) {
    Component = component;
  }
  if (typeof avatar === 'string') {
    avatar = {uri: avatar};
  }
  return (
    <Component
      onLongPress={onLongPress}
      onPress={onPress}
      underlayColor={underlayColor}
      style={[styles.container, containerStyle && containerStyle]}
      {...attributes}
    >
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
        <View style={styles.left}>
          {React.isValidElement(leftIcon)
            ? leftIcon
            : leftIcon &&
            leftIcon.name &&
            <LeftIconWrapper
              onLongPress={leftIconOnLongPress}
              onPress={leftIconOnPress}
              underlayColor={leftIconUnderlayColor}
              style={[
                styles.iconStyle,
                {flex: rightTitle && rightTitle !== '' ? 0.3 : 0.15},
                leftIconContainerStyle && leftIconContainerStyle,
              ]}
            >
              <View>
                <Icon
                  type={leftIcon.type}
                  iconStyle={[styles.icon, leftIcon.style && leftIcon.style]}
                  name={leftIcon.name}
                  color={leftIcon.color || colors.grey4}
                  size={leftIcon.size || 24}
                />
              </View>
            </LeftIconWrapper>}
          {avatar &&
          <View style={styles.avatar}>
            {React.isValidElement(avatar)
              ? avatar
              : <Avatar
                avatarStyle={avatarStyle && avatarStyle}
                containerStyle={avatarContainerStyle && avatarContainerStyle}
                overlayContainerStyle={
                  avatarOverlayContainerStyle && avatarOverlayContainerStyle
                }
                rounded={roundAvatar}
                source={avatar}
              />}
          </View>}
          <View style={[styles.titleSubtitleContainer,
            titleSubtitleContainerStyle && titleSubtitleContainerStyle]}>
            <View style={titleContainerStyle}>
              {title !== null &&
              (typeof title === 'string' || typeof title === 'number')
                ? <Text
                  numberOfLines={titleNumberOfLines}
                  style={[
                    styles.title,
                    !leftIcon && {marginLeft: 10},
                    titleStyle && titleStyle,
                    fontFamily && {fontFamily},
                  ]}
                >
                  {title}
                </Text>
                : <View>
                  {title}
                </View>}
            </View>
            <View style={subtitleContainerStyle}>
              {subtitle !== null &&
              (typeof subtitle === 'string' || typeof subtitle === 'number')
                ? <Text
                  numberOfLines={subtitleNumberOfLines}
                  style={[
                    styles.subtitle,
                    !leftIcon && {marginLeft: 10},
                    subtitleStyle && subtitleStyle,
                    fontFamily && {fontFamily},
                  ]}
                >
                  {subtitle}
                </Text>
                : <View>
                  {subtitle}
                </View>}
            </View>
          </View>
        </View>
        {(textInput || rightTitle || !hideChevron || badge
          || switchButton || label) &&
          <View style={[styles.right,{alignSelf:'center' }]} >
            {rightTitle &&
            rightTitle !== '' &&
            !textInput &&
            <View style={[styles.rightTitleContainer, rightTitleContainerStyle]}>
              <Text
                numberOfLines={rightTitleNumberOfLines}
                style={[styles.rightTitleStyle, rightTitleStyle]}
              >
                {rightTitle}
              </Text>
            </View>}
            {textInput &&
            <View
              style={[
                styles.rightTitleContainer,
                styles.textInputContainerStyle,
                textInputContainerStyle,
              ]}
            >
              <TextInput
                style={[styles.textInputStyle, textInputStyle]}
                underlineColorAndroid={'transparent'}
                defaultValue={rightTitle}
                value={textInputValue}
                placeholder={textInputPlaceholder}
                autoCapitalize={textInputAutoCapitalize}
                autoCorrect={textInputAutoCorrect}
                autoFocus={textInputAutoFocus}
                editable={textInputEditable}
                keyboardType={keyboardType}
                maxLength={textInputMaxLength}
                multiline={textInputMultiline}
                onChangeText={textInputOnChangeText}
                onFocus={textInputOnFocus}
                onBlur={textInputOnBlur}
                secureTextEntry={textInputSecure}
                selectTextOnFocus={textInputSelectTextOnFocus}
                returnKeyType={textInputReturnKeyType}
              />
            </View>}
            {badge && !rightTitle && <Badge {...badge} />}
            {!hideChevron &&
            (React.isValidElement(rightIcon)
              ? rightIcon
              : <TouchableOpacity
                onPress={onPressRightIcon}
                disabled={!onPressRightIcon}
                style={styles.chevronContainer}
              >
                <Icon
                  type={rightIcon.type}
                  iconStyle={rightIcon.style}
                  size={28}
                  name={rightIcon.name || 'chevron-right'}
                  color={rightIcon.color || chevronColor}
                />
              </TouchableOpacity>)}
            {switchButton &&
            hideChevron &&
            <View style={styles.switchContainer}>
              <Switch
                onValueChange={onSwitch}
                disabled={switchDisabled}
                onTintColor={switchOnTintColor}
                thumbTintColor={switchThumbTintColor}
                tintColor={switchTintColor}
                value={switched}
              />
            </View>}
            {label && label}
          </View>
        }
      </View>
    </Component>
  );
};

ListItem.defaultProps = {
  leftIconUnderlayColor: 'white',
  chevronColor: colors.grey4,
  rightIcon: {name: 'chevron-right'},
  subtitleContainerStyle: {marginTop: 10},
  underlayColor: colors.greyOutline,
  hideChevron: false,
  roundAvatar: false,
  switchButton: false,
  textInputEditable: true,
  titleNumberOfLines: 1,
  subtitleNumberOfLines: 1,
  rightTitleNumberOfLines: 1,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomColor: colors.greyOutline,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  left:{
    flex:3,
    flexDirection:'row',
  },
  avatar: {
    alignSelf: 'center',
  },
  titleSubtitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: normalize(16),
    color: colors.grey1,
  },
  subtitle: {
    color: colors.grey3,
    fontSize: normalize(12),
    marginTop: 1,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        ...fonts.android.bold,
      },
    }),
  },
  right:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rightTitleContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  chevronContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  switchContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 5,
  },
  rightTitleStyle: {
    marginRight: 5,
    color: colors.grey4,
  },
  textInputContainerStyle: {
    alignItems: null,
  },
  textInputStyle: {
    height: 20,
    flex: 1,
    textAlign: 'right',
  },
});

export default ListItem;
