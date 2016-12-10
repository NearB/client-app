import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

import _s from 'underscore.string';
import { Card, Button } from 'react-native-material-design';

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
        <View style={{flex:1,  justifyContent: 'center', alignItems: 'stretch', margin: 20}}>
          <Card>
            <Card.Media
                elevation={4}
                height={300}
                image={<Image resizeMode={Image.resizeMode.stretch}
                              source={{uri: this.state.stockProduct.product.img}}/>}
            />
            <Card.Body>
              <Text style={{margin:10, fontSize: 18}}>{_s.humanize(this.state.stockProduct.product.description)}</Text>
              <Text style={{marginLeft:10, fontSize: 16, fontWeight:'bold'}}>Precio: ${this.state.stockProduct.price}</Text>
            </Card.Body>
            <Card.Actions position="right">
              <Button text="CLOSE" value="CLOSE" onPress={this.onClose}/>
            </Card.Actions>
          </Card>
        </View>
    );
  }
}
