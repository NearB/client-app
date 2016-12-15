let config;

try {
  config = require('../config');
} catch (e) {
  console.error(e);
  config = {
    IP: '192.168.0.103',
    PORT: '10000'
  }
}

const DEFAULT_HEADERS = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  json: true
};

export default class MobileClient {

  constructor() {
    this.IP = config.IP;
    this.PORT = config.PORT;

    this.locations.bind(this);
    this.locate.bind(this);
    this.users.bind(this);
    this.stores.bind(this);
    this._fetch.bind(this);
  }

  login(method, relative = '', config = {}){
    const resource = 'login/';
    return this._fetch(method, `${resource}${relative}`, config);
  }

  engage(relative = ''){
    const resource = 'engage';
    return this._fetch('POST', `${resource}${relative}`, {});
  }

  locations(method, relative = '', config ={}){
    const resource = 'locations/';
    return this._fetch(method, `${resource}${relative}`, config);
  }

  locate(method, relative = '', config = {}){
    const resource = 'locate/';
    return this._fetch(method, `${resource}${relative}`, config);
  }

  users(method, relative = '', config = {}){
    const resource = 'users/';
    return this._fetch(method, `${resource}${relative}`, config);
  }

  stores(method, relative = '', config = {}){
    const resource = 'stores/';
    return this._fetch(method, `${resource}${relative}`, config);
  }

  promotions(method, relative = '', config = {}){
    const resource = 'promotions/';
    return this._fetch(method, `${resource}${relative}`, config);
  }

  carts(method, relative = '', config = {}){
    const resource = 'carts/';
    return this._fetch(method, `${resource}${relative}`, config);
  }

  _fetch(method, relative, userConfig){
    const url = `http://${this.IP}:${this.PORT}/api/${relative}`;

    console.log(url);
    const config = Object.assign({},
       userConfig,
      { method: method },
       DEFAULT_HEADERS
     );

    console.log(`Fetching ${url}`);
    console.log('Config: ', config);

    return fetch(url, config).then(r => r.json());
  }
}

module.exports = MobileClient;
