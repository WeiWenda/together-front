import {server} from '../urls';
module.exports = {
  SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY',
  backend: {
    springRemote:false,
    springLocal:true,
    parseRemote: false,
    parseLocal: false
  },
  Spring:{
    local:{
      url:server
    },
    remote: {
      url: 'http://snowflake-parse.herokuapp.com/parse'   // match SERVER_URL in parse-server's index.js
    }
  },
  PARSE: {
    appId: 'snowflake',                              // match APP_ID in parse-server's index.js
    local: {
      url: 'http://localhost:1337/parse'             // match SERVER_URL in parse-server's index.js
    },
    remote: {
      url: 'http://snowflake-parse.herokuapp.com/parse'   // match SERVER_URL in parse-server's index.js
    }
  }
}
