import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Navigator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class NavBarButton extends Component {

  constructor(props){
    super(props);
    this.icon = props.icon;
    this.clickCallback = props.onPress;
    this.buttonStyle = props.right ? styles.right : styles.left;
  }
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.clickCallback}>
          <Icon name={this.icon}
            style={this.buttonStyle}
            allowFontScaling={true}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  left: {
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    color:'#FFFFFF',
    marginTop: 15,
    marginLeft: 12
  },
  right: {
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    color:'#FFFFFF',
    marginTop: 15,
    marginRight: 12
  }
});


module.exports = NavBarButton;
