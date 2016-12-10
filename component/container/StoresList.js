import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Navigator,
    ListView
} from 'react-native';

import _s from 'underscore.string';

import MobileClient from '../../utils/MobileClient';
import NavLeft from '../common/NavigatorLeft';

const service = new MobileClient();
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class StoresList extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.userId = props.userId;

    console.log({
      username: this.username,
      userId: this.userId
    });

    this.state = {
      stores: ds.cloneWithRows([])
    };

    this._fetchStores = this._fetchStores.bind(this);
    this._selectStore = this._selectStore.bind(this);
    this._next = this._next.bind(this);
  }

  componentDidMount() {
    this._fetchStores();
  }

  _fetchStores() {
    service.stores('GET', '')
        .then((res) => {
          const data = res.data;
          console.log(data);
          this.setState({
            stores: ds.cloneWithRows(data)
          });
        })
        .catch((error) => {
          console.log(error);
        });
  }

  _selectStore(store) {
    service.engage(`?userId=${this.userId}&storeId=${store._id}`)
        .then(res => {
          this._next(res.data, store);
        })
        .catch(err => {
          console.log(err);
        });
  }

  renderScene(route, navigator) {
    return (
        <View style={styles.container}>
          <Text style={{marginTop: 40}}>SPACER</Text>
          <ListView
              dataSource={this.state.stores}

              renderRow={ (rowData) => {
                return (
                    <TouchableOpacity style={{margin: 20}}
                                      onPress={() => {
                                        this._selectStore(rowData);
                                      }}>
                      <View style={styles.apInfo}>
                        <Image style={{width: 50, height: 50}}
                               source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}/>
                        <Text style={{marginLeft: 15, fontSize: 18, fontWeight: 'bold'}}>
                          {_s.humanize(rowData.name)}:
                        </Text>
                        {rowData.locations.length > 0
                            ? <Text style={{fontSize: 14, fontWeight: 'bold'}}> {rowData.locations.length} Nearby Locations</Text>
                            : <Text style={{fontSize: 14, fontWeight: 'bold'}}>No locations</Text>}
                      </View>
                    </TouchableOpacity>
                );
              }
              }
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
          />
        </View>
    );
  }

  _next(engagement, store) {

    const route = {
      id: 'StoreContent',
      name: 'StoreContent',
      store: store,
      username: this.username,
      userId: this.userId,
      engagementToken: engagement.engagementToken,
      cartId: engagement.cartId
    };

    console.log(route);
    this.props.navigator.push(route);
  }

  render() {
    return (
        <Navigator
            renderScene={this.renderScene.bind(this)}
            navigationBar={
              <Navigator.NavigationBar
                  routeMapper={{
                    LeftButton: (route, navigator, index, navState) => {
                      return (
                          <NavLeft onPress={()=> {
                            this.props.navigator.pop();
                          }}/>
                      );
                    },
                    RightButton: (route, navigator, index, navState) => {
                      return null;
                    },
                    Title: (route, navigator, index, navState) => {
                      return (
                          <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.barTitle}>Stores</Text>
                          </View>
                      );
                    },
                  }}
                  style={{backgroundColor: '#FA8428'}}
              />
            }
        />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  barTitle: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 10,
    marginTop: 15,
    marginLeft: 100,
    color: 'white'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  apInfo: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});


module.exports = StoresList;
