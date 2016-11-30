import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  Image,
  TouchableOpacity,
  Navigator,
  ListView
} from 'react-native';

import _s from 'underscore.string';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import {Button} from 'react-native-material-design';
import WifiClient from '../../utils/WifiClient';

import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();

import NavLeft from '../common/NavigatorLeft';

export default class UserHome extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.userId= props.userId;
    if (this.username == null || this.userId == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    console.log({
      username: this.username,
      userId: this.userId
    });

    this.wifi = new WifiClient("Clients", this.username);

    this._discoverStores = this._discoverStores.bind(this);
    this._getPromotions = this._getPromotions.bind(this);
    this._whereAmI = this._whereAmI.bind(this);
    this._next = this._next.bind(this);
  }

  _discoverStores(store){
    const route = {
      id: 'AddStore',
      name: 'AddStore',
      userId: this.userId,
      username: this.username
    };

    this._next(route);
  }
  _getPromotions(){
    const route = {
      id: 'PromotionsViewer',
      name: 'PromotionsViewer',
      userId: this.userId,
      username: this.username
    };

    this._next(route);
  }

  _whereAmI(){
    this.wifi.getNearestAp()
      .then((ap) => {
        console.log(ap);
        const qparams = encodeURI(ap.trackingInfo.fingerprints().join(','));
        service.locate('GET', `?beacons=${qparams}&username=appLocator&group=Stores`, {})
        .then(res => {
          console.log(res.data);
          const [store, location] = res.data.location.split(":")
          Alert.alert(
             'Current Location',
             `The nearest the place is ${location}\n inside Store ${store}`,
             [
               {text: 'OK', onPress: () => console.log('OK Pressed!')},
             ]
           );
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <Button text='Discover Stores'onPress={this._discoverStores}
                style={{marginTop: 30}} raised={true} value="NORMAL RAISED" theme='light'/>
        <Button text='Nearby Promotions' onPress={this._getPromotions}
                style={{marginTop: 30}} raised={true} value="NORMAL RAISED" theme='light'/>
        <Button text='Where Am I?' onPress={this._whereAmI}
                style={{marginTop: 30}} raised={true} value="NORMAL RAISED" theme='light'/>
      </View>
    );
  }

  _next(route) {
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
              LeftButton: (route, navigator, index, navState) =>
              { return (
                  <NavLeft onPress={()=>{ this.props.navigator.pop();}}/>
                );
              },
              RightButton: (route, navigator, index, navState) =>
              { return null; },
              Title: (route, navigator, index, navState) =>
              { return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.barTitle}>Welcome</Text>
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
  textfield: {
    width: 150,
    marginTop: 32,
    margin: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
  },
  barTitle: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 10,
    marginTop: 15,
    marginLeft: 90,
    color: 'white'
  },
  enabledNext: {
    color: '#FA8428',
    fontSize: 50,
    marginTop: 10
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  disabledNext: {
    color: '#808080',
    fontSize: 50,
    marginTop: 10
  },
  apInfo: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});


module.exports = UserHome;
