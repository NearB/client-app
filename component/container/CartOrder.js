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

import ProductDetailModalContent from './ProductDetailModalContent';
import CartPeakModalContent from './CartPeakModalContent';
import CartActionButton from './CartActionButton';

import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();
import NavLeft from '../common/NavigatorLeft';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


export default class CartOrder extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.userId = props.userId;
    this.engagementToken = props.engagementToken;

    console.log({
      username: this.username,
      userId: this.userId,
      engagementToken: this.engagementToken,
      products: this.products
    });

    if (this.username == null || this.userId == null || this.engagementToken == null || this.products == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }
    const tokenParts = this.engagementToken.split(':');
    if (this.userId != tokenParts[0]){
      throw new Error(`Invalid token expected [${this.userId}] but was [${tokenParts[0]}]`);
    }
    this.storeId = tokenParts[1];
    if (tokenParts.length > 3){
      this.originAdId = tokenParts[3];
    }

    const quantityByProduct = new Map();
    props.productsForOrder.forEach(p => {quantityByProduct.set(p.product._id, 1)});

    this.state = {
      quantityByProduct:  quantityByProduct,
      products: props.productsForOrder
    };

    this._removeFromCart = this._removeFromCart.bind(this);
    this._createCart = this._createCart.bind(this);
    this._order = this._order.bind(this);
    this._updateProdQuantity = this._updateProdQuantity.bind(this);
    this._addToCart = this._addToCart.bind(this);
    this._getCartProducts = this._getCartProducts.bind(this);
    this._next = this._next.bind(this);
  }

  _updateProdQuantity(productId, quantity){
    this.state.quantityByProduct.set(productId, quantity);
    this.setState({
      quantityByProduct: this.state.quantityByProduct
    });
  }

  _removeFromCart(product){
    this.setState({
      products: this.state.products.splice(this.state.products.indexOf(product), 1)
    });
  }

  _order(){
    const cart = this._createCart();
    console.log(cart);
    // service.stores('GET', `${this.storeId}/products`)
    //   .then((res) => {
    //     const products = res.data;
    //     console.log(products);
    //     this.setState({
    //       products:
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  _createCart(){
    const cartProducts = [];
    this.state.products.forEach(p => {
      cartProducts.push({
        productId: p.product._id,
        quantity: this.state.quantityByProduct.get(p.product._id),
        price: p.price
      })
    });

    const cart = {
      total: cartProducts.reduce((a, b)=> {return (a.price * a.quantity) + (b.price * b.quantity)}),
      products: cartProducts
    };

    return cart;
  }

  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <Text style={{marginTop:30}}>SPACER</Text>
        <ListView
          dataSource={ds.cloneWithRows(this.state.products)}

          renderRow={ (stockProduct) => {
            return (
              <View style={styles.apInfo}>
                <Image style={{width: 80, height: 80, borderRadius: 40}}
                  source={{uri: stockProduct.product.img}}/>
                <View style={{flex:1}}>
                  <Text style={{marginLeft:15, fontSize: 15, fontWeight: 'bold'}}>
                    {_s.humanize(stockProduct.product.name)}:
                  </Text>
                  <View style={{flex:1, flexDirection:'row'}}>
                    <Text style={{marginLeft:15, fontSize: 15}}>Price: ${stockProduct.price}</Text>
                      <Picker
                        selectedValue={this.state.quantityByProduct.get(stockProduct.product._id)}
                        onValueChange={(val) => {this._updateProdQuantity(stockProduct.product._id, val)}}>

                        {/* TODO HORRIBLE HACK*/}
                        <Picker.Item value="0"/>
                        <Picker.Item value="1"/><Picker.Item value="2"/>
                        <Picker.Item value="3"/><Picker.Item value="4"/>
                        <Picker.Item value="5"/><Picker.Item value="6"/>
                        <Picker.Item value="7"/><Picker.Item value="8"/>
                        <Picker.Item value="9"/><Picker.Item value="10"/>
                        <Picker.Item value="11"/><Picker.Item value="12"/>
                      </Picker>
                  </View>
                </View>
                <Icon name="times-circle" style={styles.nonSelectedProductIcon}
                      allowFontScaling={true}
                      onPress={() => {this._removeFromCart(stockProduct);}}/>
              </View>
            );
            }
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />

        <Button value="NORMAL RAISED" raised={true} onPress={this.learn.bind(this)}
                    text='Place Order' theme='light'/>
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
              LeftButton: (route, navigator, index, navState) =>
              { return (
                  <NavLeft onPress={()=>{ this.props.navigator.pop();}}/>
                );
              },
              RightButton: (route, navigator, index, navState) =>
              { return null; },
              Title: (route, navigator, index, navState) =>
              { return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.barTitle}>Stores</Text>
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
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  apInfo: {
    flex: 0.3,
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
