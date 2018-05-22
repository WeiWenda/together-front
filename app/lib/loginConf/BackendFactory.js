/**
 * # BackendFactory
 *
 * This class sets up the backend by checking the config.js
 *
 */
'use strict'

import CONFIG from './config'
import {parse} from './Parse'
import {spring} from './Spring'

export default function BackendFactory (token = null) {
  if (CONFIG.backend.springLocal || CONFIG.backend.springRemote) {
    spring.initialize(token)
    return spring
  } else if (CONFIG.backend.parseLocal || CONFIG.backend.parseRemote) {
    parse.initialize(token)
    return parse
  }
}
