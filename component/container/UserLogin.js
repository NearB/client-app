import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ToolbarAndroid,
    Navigator
} from 'react-native';

const Auth0Lock = require('react-native-lock');
const lock = new Auth0Lock({clientId: 'WHAUC4hTUIgUob7G2emVloLIJsXbRG3v', domain: 'alegmarra.auth0.com'});

import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();

export default class UserLogin extends Component {

  constructor(props) {
    super(props);


    this._next = this._next.bind(this);

    lock.show({closable:true, disableResetPassword:true},
        (err, profile, token) => {
          if (err) {
            console.log(err);
            return;
          }
          service.login('POST','', {
                body: JSON.stringify(profile)
              })
              .then(createResult => {
                console.log(createResult);
                this.userId = createResult.data._id;
                this.username = createResult.data.username;
                this._next();
              })
              .catch(error => {
                console.log(error);
              });
        }
    )
  }

  renderScene(route, navigator) {
    return null;
  }

  _next() {
    const route = {
      id: 'UserHome',
      name: 'UserHome',
      username: this.username,
      userId: this.userId
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
});


module.exports = UserLogin;
