/**
 * # Login.js
 *
 *  The container to display the Login form
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../../reducers/auth/authActions'

/**
 *   LoginRender
 */
import LoginRender from '../../components/signin/LoginRender'

/**
 * The necessary React screens
 */
import React,{Component} from 'react'

const {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
} = require('../../lib/loginConf/constants').default

/**
 * ## Redux boilerplate
 */

function mapStateToProps (state) {
  return {
    auth: state.auth,
    global: state.global
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

function buttonPressHandler (login, username, password,navigation) {
  login(username, password,navigation)
}

/**
 * ### Translations
 */
import I18n from 'react-native-i18n';

class Login extends Component{

  render () {
    let loginButtonText = I18n.t('Login.login');
    let onButtonPress = buttonPressHandler.bind(null,
                                                this.props.actions.login,
                                                this.props.auth.form.fields.username,
                                                this.props.auth.form.fields.password,
                                                this.props.navigation
                                               )

    return (
      <LoginRender
        navigation = {this.props.navigation}
        formType={LOGIN}
        loginButtonText={loginButtonText}
        onButtonPress={onButtonPress}
        displayPasswordCheckbox
        leftMessageType={REGISTER}
        rightMessageType={FORGOT_PASSWORD}
        auth={this.props.auth}
        global={this.props.global}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
