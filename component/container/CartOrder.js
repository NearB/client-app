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

    this.cart = props.cart;
    this.userId = props.userId;
    this.username = props.username;
    this.engagementToken = props.engagementToken;
    this.products = props.productsForOrder;

    console.log({
      cart: this.cart,
      userId: this.userId,
      products: this.products,
      username: this.username,
      engagementToken: this.engagementToken,
    });

    if (this.username == null || this.userId == null || this.engagementToken == null ||
        this.products == null || this.cart == null){
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
    props.productsForOrder.forEach(p => {quantityByProduct.set(p.product._id, '1')});

    this.state = {
      quantityByProduct:  quantityByProduct,
      products: props.productsForOrder,
      total: this._productsTotal(props.productsForOrder)
    };

    this.rowIsWhite = false;

    this._createCart = this._createCart.bind(this);
    this._order = this._order.bind(this);
    this._updateProdQuantity = this._updateProdQuantity.bind(this);
    this._next = this._next.bind(this);
  }

  _productsTotal(prods){
    return prods.reduce((a, b)=> {return (a.price * 1 * a.quantity) + (b.price * 1 * b.quantity)});
  }

  _updateProdQuantity(productId, quantity){
    this.state.quantityByProduct.set(productId, quantity);
    this.setState({
      quantityByProduct: this.state.quantityByProduct
    });
  }

  _order(){
    const cart = this._createCart();
    console.log(cart);

    service.carts('PUT', `${this.cart._id}/products/?engagement=${this.engagementToken}`, {
      body: JSON.stringify(cart.products)
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    this.props.navigator.pop();
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
      total: this._productsTotal(cartProducts),
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
            this.rowIsWhite = !this.rowIsWhite;
            const backColor = this.rowIsWhite ? '#FFFFFF' : '#FFF4E1';

            return (
              <View style={{backgroundColor: backColor}}>
                <View style={styles.apInfo}>
                  <Image style={{width: 50, height: 50, borderRadius: 25}}
                    source={{uri: stockProduct.product.img}}/>
                  <View style={{flex:1}}>
                    <Text style={{marginLeft:15, fontSize: 15, fontWeight: 'bold'}}>
                      {_s.humanize(stockProduct.product.name)}:
                    </Text>
                    <Text style={{marginLeft:15, fontSize: 15}}>Price: ${stockProduct.price}</Text>
                  </View>
                  <Picker
                    style={{ flex: 0.3}}
                    selectedValue={this.state.quantityByProduct.get(stockProduct.product._id)}
                    onValueChange={(val) => {this._updateProdQuantity(stockProduct.product._id, val)}}>
                      <Picker.Item label="1" value="1"/><Picker.Item label="2" value="2"/>
                      <Picker.Item label="3" value="3"/><Picker.Item label="4" value="4"/>
                      <Picker.Item label="5" value="5"/><Picker.Item label="6" value="6"/>
                      <Picker.Item label="7" value="7"/><Picker.Item label="8" value="8"/>
                      <Picker.Item label="9" value="9"/><Picker.Item label="10" value="10"/>
                   </Picker>
                </View>
              </View>
            );
            }
          }
        />

      <View style={{margin:15}}>
        <Button value="NORMAL RAISED" raised={true}  onPress={this._order}
                      text='Place Order' theme='dark'/>
      </View>
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
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin:20,
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
