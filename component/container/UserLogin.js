import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToolbarAndroid,
  Navigator
} from 'react-native';

import {MKTextField} from 'react-native-material-kit';

import _s from 'underscore.string';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavLeft from '../common/NavigatorLeft';
import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();

export default class UserLogin extends Component {

  constructor(props) {
    super(props);

    this.user = '';
    this.pass = '';

    this.state = {
      disableSubmit: true,
      iconStyle: styles.enabledNext
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this._toogleSubmit = this._toogleSubmit.bind(this);
    this._next = this._next.bind(this);
  }

  handleUserUpdate(user) {
    this.user = user;
    this._toogleSubmit();
  }

  handlePasswordUpdate(pass) {
    this.pass = pass;
    this._toogleSubmit();
  }

  _toogleSubmit() {
    const disable = _s.isBlank(this.user) || _s.isBlank(this.pass);
    if (this.state.disableSubmit !== disable) {
      this.setState({disableSubmit: disable})
    }
  }

  handleSubmit() {
    service.users('POST', '', {
      body: JSON.stringify({
        username: this.user,
        name: this.user,
        stores: [],
        filters: []
      })
    })
    .then(res => {
      console.log(res);
      this.userId = res.data._id;
      this._next();
    })
    .catch(err => {
      console.log("TOP");
      console.log(err);
    });
  }

  renderScene(route, navigator) {
    return (
        <View style={styles.container}>
          <View style={{flex: 1, flexDirection: 'column',   alignItems: 'center',
            justifyContent: 'center',}}>
            <MKTextField placeholder='Username'
                         style={styles.textfield}
                         underlineEnabled={true}
                         onTextChange={this.handleUserUpdate}
                         returnKeyType="next"
            />
            <MKTextField placeholder='Password'
                         style={styles.textfield}
                         underlineEnabled={true}
                         password={true}
                         onTextChange={this.handlePasswordUpdate}
                         returnKeyType="next"
            />
          </View>
          <View style={{flex: 0.5, flexDirection: 'column',   alignItems: 'flex-start',
                justifyContent: 'center',}}>
            {this.state.disableSubmit ? null
              : <Icon name="arrow-circle-right" style={this.state.iconStyle}
                  allowFontScaling={true}
                  onPress={this.handleSubmit}/>}
          </View>
        </View>
    );
  }

  _next() {
    if (!this.state.disableSubmit) {
      const route = {
        id: 'UserHome',
        name: 'UserHome',
        username: this.user,
        userId: this.userId
      };

      console.log(route);
      this.props.navigator.push(route);
    }
  }

  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) =>
              { return null; },
              RightButton: (route, navigator, index, navState) =>
              { return null; },
              Title: (route, navigator, index, navState) =>
              { return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.barTitle}>Login</Text>
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
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  barTitle: {
    fontSize: 20,
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    marginTop: 15,
    marginLeft: 100,
    color: 'white'
  },
  enabledNext: {
    color: '#FA8428',
    fontSize: 70,
    marginTop: 10
  },
  disabledNext: {
    color: '#808080',
    fontSize: 70,
    marginTop: 10
  }
});


module.exports = UserLogin;
