const TRELLO_CONFIG = {

  API_KEY: '47d46009738ac47134421fe54f42b766',
  
  REDIRECT_URI: 'http://localhost:5173/trello/callback',
  
  APP_NAME: 'Team Finder',
 
  SCOPE: 'read,write',
  
  EXPIRATION: 'never',
  
  API_BASE_URL: 'https://api.trello.com/1',
  
  AUTH_URL: 'https://trello.com/1/authorize',

  RESPONSE_TYPE: 'token'
};

export default TRELLO_CONFIG;