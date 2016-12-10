import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    View,
    Image,
    TouchableOpacity,
    Navigator,
    Modal,
    ListView
} from 'react-native';

import {Button} from 'react-native-material-design';

import NavLeft from '../common/NavigatorLeft';
import NavButton from '../common/NavBarButton';
import PreferencesModalContent from './PreferencesModalContent';

import WifiClient from '../../utils/WifiClient';
import MobileClient from '../../utils/MobileClient';

const service = new MobileClient();


export default class UserHome extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.userId = props.userId;
    if (this.username == null || this.userId == null) {
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    console.log({
      username: this.username,
      userId: this.userId
    });

    this.wifi = new WifiClient("Clients", this.username);
    this.latestBeacons = null;
    this.beaconUpdater = null;

    this.state = {
      availableTags: [],
      selectedTags: [],
      showPreferences: false
    };

    this._next = this._next.bind(this);
    this._whereAmI = this._whereAmI.bind(this);
    this._updateBeacons = this._updateBeacons.bind(this);
    this._updateAvailableTags = this._updateAvailableTags.bind(this);
    this._getNearbyBeacons = this._getNearbyBeacons.bind(this);
    this._openPreferences = this._openPreferences.bind(this);
    this._savePreferences = this._savePreferences.bind(this);
    this._getPromotions = this._getPromotions.bind(this);
    this._discoverStores = this._discoverStores.bind(this);
    this._alertCurrentLocation = this._alertCurrentLocation.bind(this);
  }


  componentDidMount() {
    this._updateBeacons(this._updateAvailableTags);
    this.beaconUpdater = setInterval(() => {
        this._updateBeacons(this._updateAvailableTags);
    }, 30000);
  }

  componentWillUnmount() {
    if (this.beaconUpdater != null){
      clearInterval(this.beaconUpdater);
    }
  }

  _updateBeacons(cb){
    this._getNearbyBeacons()
        .then(beacons => {
          this.latestBeacons = beacons;
          if (cb != null){
            cb(beacons);
          }
        }).catch(err => {
      console.log(err);
    });
  }

  _updateAvailableTags(beacons){
    service.promotions('GET', `tags?beacons=${beacons}`, {})
        .then(res => {
          if (res.err == null){
            this.setState({
              availableTags: res.data
            });
          } else {
            console.log(res.err);
          }
        }).catch(err => {
          console.log(err);
        });
  }

  _discoverStores(store) {
    const route = {
      id: 'StoresList',
      name: 'StoresList',
      userId: this.userId,
      username: this.username,
      selectedTags: this.state.selectedTags,
      allTags: this.state.availableTags
    };

    this._next(route);
  }

  _getPromotions() {
    const route = {
      id: 'PromotionsViewer',
      name: 'PromotionsViewer',
      userId: this.userId,
      username: this.username,
      selectedTags: this.state.selectedTags,
      allTags: this.state.availableTags
    };

    this._next(route);
  }

  _openPreferences() {
    this.setState({showPreferences: true});
  }

  _savePreferences(selected) {
    this.setState({
      selectedTags: selected,
      showPreferences: false
    });
  }

  _getNearbyBeacons() {
    return this.wifi.getNearestAp()
        .then(ap => {
          return new Promise((resolve, reject) => {
            const beacons = encodeURI(ap.trackingInfo.fingerprints().join(','));
            if (beacons.length > 0) {
              resolve(beacons);
            } else {
              reject(ap);
            }
          });
        });
  }

  _whereAmI() {
    if (this.latestBeacons != null){
      this._alertCurrentLocation();
    } else{
      this._getNearbyBeacons()
          .then(beacons => {
            this.latestBeacons = beacons;
            this._alertCurrentLocation();
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }

  _alertCurrentLocation(){
    service.locate('GET', `?beacons=${this.latestBeacons}&username=appLocator&group=Stores`, {})
        .then(res => {
          const [store, location] = res.data.location.split(":");
          Alert.alert(
              'Current Location',
              `The nearest the place is ${location}\n inside Store ${store}`,
              [
                {text: 'OK', onPress: () => console.log('OK Pressed!')},
              ]
          );
        })
  }

  renderScene(route, navigator) {
    return (
        <View style={styles.container}>
          <Modal transparent={true} visible={this.state.showPreferences} animationType='fade'>
            <PreferencesModalContent tags={this.state.availableTags} selected={this.state.selectedTags}
                                     saveHandler={this._savePreferences}
                                     closeHandler={() => {
                                       this.setState({showPreferences: false});
                                     }}
            />
          </Modal>

          <View style={{margin: 20}}>
            <Button text='Discover Stores' onPress={this._discoverStores}
                    raised={true} value="NORMAL RAISED" theme='light'/>
          </View>

          <View style={{margin: 20}}>
            <Button text='Nearby Promotions' onPress={this._getPromotions}
                    raised={true} value="NORMAL RAISED" theme='light'/>
          </View>

          <View style={{margin: 20}}>
            <Button text='Where Am I?' onPress={this._whereAmI}
                    raised={true} value="NORMAL RAISED" theme='light'/>
          </View>

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
                    LeftButton: (route, navigator, index, navState) => {
                      return (
                          <NavLeft onPress={()=> {
                            this.props.navigator.pop();
                          }}/>
                      );
                    },
                    RightButton: (route, navigator, index, navState) => {
                      return (
                          <NavButton icon="gear" right onPress={this._openPreferences}/>
                      );
                    },
                    Title: (route, navigator, index, navState) => {
                      return (
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
    margin: 30,
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
