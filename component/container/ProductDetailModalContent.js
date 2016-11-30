import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Navigator,
  ListView,
  Modal,
  Picker
} from 'react-native';

import _s from 'underscore.string';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import {Button} from 'react-native-material-design';
import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();
import NavLeft from '../common/NavigatorLeft';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ProductDetailModalContent extends Component {

  //stockProduct, closeHandler
  constructor(props){
    super(props);
    this.onClose = props.closeHandler;
    this.state = {
      stockProduct: props.stockProduct
    }
  }

  render(){
    return (
        <View style={{flex:1,  justifyContent: 'center', alignItems: 'stretch', margin: 40}}>
            <View style={{backgroundColor:'#F1F1F1'}}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
                <Image style={{margin: 5, width: 100, height: 100, borderRadius: 50}}
                  source={{uri: this.state.stockProduct.product.img}}/>
                <View style={{flex:1}}>
                  <Text style={{margin:15, fontSize: 25, fontWeight: 'bold'}}>
                    {_s.humanize(this.state.stockProduct.product.name)}
                  </Text>
                  <Text style={{marginLeft:15, fontSize: 20}}>Price: ${this.state.stockProduct.price}</Text>
                </View>

              </View>
              <Text style={{margin:30, fontSize: 18}}>
                {_s.humanize(this.state.stockProduct.product.description)}
                TODO: REPLACE MODAL CONTENT WITH MATERIAL DESIGN CARD
              </Text>
              <View style={{flex:0.2, flexDirection:'row',
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
