import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Navigator,
  ListView,
  Modal
} from 'react-native';

import _s from 'underscore.string';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import {Button} from 'react-native-material-design';
import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();
import NavLeft from '../common/NavigatorLeft';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class CartActionButton extends Component {

  //cartProducts, peakHandler, checkoutHandler
  constructor(props){
    super(props);
    this.onPeak = props.peakHandler;
    this.onOrder = props.orderHandler;
    this.onCheckout = props.checkoutHandler;
    console.log(props.hasProducts);
  }

  render(){
    return(
      <ActionButton buttonColor="#FA8428"
           position="right"
           icon={<Icon name='shopping-cart' size={30} style={{marginRight: 5}} color="#FFFFFF" />}>
            <ActionButton.Item titleBgColor='#F5FCFF' buttonColor='#53B3F9'
                title='Peak'
                titleBgColor='F5FCFF'
                textStyle={{fontSize: 15, fontWeight: 'bold'}}
                onPress={this.onPeak}>
                  <Icon name="search" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item titleBgColor='#F5FCFF' buttonColor='#5367F9'
                title='Order'
                titleBgColor='F5FCFF'
                textStyle={{fontSize: 15, fontWeight: 'bold'}}
                onPress={this.onOrder}>
                  <Icon name="hand-pointer-o" style={{fontSize: 24, height: 25, color: 'white', }} />
            </ActionButton.Item>
            <ActionButton.Item titleBgColor='#F5FCFF' buttonColor='#9b59b6'
                title='Checkout'
                titleBgColor='F5FCFF'
                textStyle={{fontSize: 15, fontWeight: 'bold'}}
                onPress={this.onCheckout}>
                  <Icon name="dollar" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
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
  enabledNext: {
    color: '#FA8428',
    fontSize: 50,
    marginTop: 10
  },
  separator: {
    flex: 0.01,
    height: 0.1,
    backgroundColor: '#8E8E8E',
  },
  apInfo: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  selectedProductIcon: {
    color: '#528AE7',
    marginLeft: 5,
    fontSize: 35
  },
  nonSelectedProductIcon: {
    color: '#FEB175',
    marginLeft: 5,
    fontSize: 35
  }
});
