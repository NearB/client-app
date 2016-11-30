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
import NavButton from './NavBarButton'

export default class NavigatorLeft extends Component {

  constructor(props){
    super(props);
    this.clickCallback = props.onPress;
  }
  render() {
    return (
      <NavButton icon="arrow-left" onPress={this.clickCallback}/>
    );
  }
}

module.exports = NavigatorLeft;
