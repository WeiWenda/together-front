/**
 * Register.js
 *
 * Allow user to register
 */
'use strict'
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../../reducers/auth/authActions'

/**
 *   LoginRender
 */
import LoginRender from '../../components/signin/LoginRender'

/**
 * The necessary React
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

function buttonPressHandler (signup, username, email, password,navigation) {
  signup(username, email, password,navigation)
}

/**
 * ### Translations
 */
import I18n from 'react-native-i18n';

class Register extends Component{

  render () {
    let loginButtonText = I18n.t('Register.register')
    let onButtonPress = buttonPressHandler.bind(null,
                                                this.props.actions.signup,
                                                this.props.auth.form.fields.username,
                                                this.props.auth.form.fields.email,
                                                this.props.auth.form.fields.password,
                                                this.props.navigation)

    return (
      <LoginRender
        navigation = {this.props.navigation}
        formType={REGISTER}
        loginButtonText={loginButtonText}
        onButtonPress={onButtonPress}
        displayPasswordCheckbox
        leftMessageType={FORGOT_PASSWORD}
        rightMessageType={LOGIN}
        auth={this.props.auth}
        global={this.props.global}
      />

    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register)
