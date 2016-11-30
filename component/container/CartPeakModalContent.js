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

export default class CartPeakModalContent extends Component {

  //cartProducts, closeHandler
  constructor(props){
    super(props);

    console.log(props.cartProducts);
    this.onClose = props.closeHandler;
    this.state = {
      cartProducts: ds.cloneWithRows(props.cartProducts),
      hasProducts: props.cartProducts.length > 0
    }
  }

  render(){
    return (
        <View style={{flex:1,  justifyContent: 'center', alignItems: 'stretch', margin: 40, borderRadius: 50}}>
            <View style={{backgroundColor:'#F1F1F1'}}>
              {
                this.state.hasProducts ?
                  <ListView
                    dataSource={this.state.cartProducts}
                    renderRow={ (stockProduct) => {
                      return (
                        <View style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          margin: 5
                        }}>
                          <Image style={{width: 40, height: 40, borderRadius: 20}}
                            source={{uri: stockProduct.product.img}}/>
                          <Text style={{marginLeft:15, fontSize: 15, fontWeight: 'bold'}}>
                            {_s.humanize(stockProduct.product.name)}
                          </Text>
                        </View>
                      );
                      }
                    }
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                  />
                :
                <Text style={{marginLeft:15, fontSize: 20}}>No products in cart</Text>
              }
            <View style={{flex:0.3, flexDirection:'row',
               justifyContent:'flex-end',
               alignItems:'center',
               marginBottom: 5}}>
                <Icon name="times-circle"
                      style={{color: '#6F6F6F', marginRight: 10, marginBottom: 10, fontSize: 35 }}
                    allowFontScaling={true}
                    onPress={this.onClose}/>
            </View>
        </View>
      </View>
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
