import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} from 'react-native';

import _s from 'underscore.string';
import { Card, Button } from 'react-native-material-design';

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
        <View style={{flex:1,  justifyContent: 'center', alignItems: 'stretch', margin: 20}}>
          <Card>
            <Card.Body>
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
            </Card.Body>
            <Card.Actions position="right">
              <Button text="CLOSE" value="CLOSE" onPress={this.onClose}/>
            </Card.Actions>
          </Card>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    flex: 0.01,
    height: 0.1,
    backgroundColor: '#8E8E8E',
  }
});
