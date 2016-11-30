
const DEFAULT_HEADERS = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  json: true
};

export default class MobileClient {

  constructor(){
    //FIXME find a better way to handle this instead of hardcoded the IP of our docker server
    this.IP = '192.168.0.100';
    this.PORT = '10000';

    this.locations.bind(this);
    this.locate.bind(this);
    this.users.bind(this);
    this.stores.bind(this);
    this._fetch.bind(this);
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
