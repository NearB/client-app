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

import ProductDetailModalContent from './ProductDetailModalContent';
import CartPeakModalContent from './CartPeakModalContent';
import CartActionButton from './CartActionButton';

import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();
import NavLeft from '../common/NavigatorLeft';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});



export default class StoreContent extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.userId = props.userId;
    this.engagementToken = props.engagementToken;

    console.log({
      username: this.username,
      userId: this.userId,
      engagementToken: this.engagementToken
    });

    if (this.username == null || this.userId == null || this.engagementToken == null){
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

    this.state = {
      products: ds.cloneWithRows([]),
      productsForCheckout: new Map(),
      productDetail: null,
      peakCart: false
    };

    this._fetchProducts = this._fetchProducts.bind(this);
    this._selectProduct = this._selectProduct.bind(this);
    this._initCart = this._initCart.bind(this);
    this._checkout = this._checkout.bind(this);
    this._peakCart = this._peakCart.bind(this);
    this._placeOrder = this._placeOrder.bind(this);
    this._removeFromCart = this._removeFromCart.bind(this);
    this._addToCart = this._addToCart.bind(this);
    this._getCartProducts = this._getCartProducts.bind(this);
    this._next = this._next.bind(this);
  }

  componentDidMount() {
    this._fetchProducts();
    this._initCart();
  }

  _fetchProducts() {
    service.stores('GET', `${this.storeId}/products`)
      .then((res) => {
        const products = res.data;
        console.log(products);
        this.setState({
          products: ds.cloneWithRows(products)
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _initCart() {
    service.carts('POST', `&engagement=${this.engagementToken}`)
      .then((res) => {
        const cart = res.data;
        console.log(cart);
        this.cart = cart;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _selectProduct(stockProduct){
    console.log(stockProduct);
    this.setState({
      productDetail: stockProduct
    })
  }

  _checkout(){
    // this._next(true, null);
  }

  _placeOrder(){
    const products = this._getCartProducts();
    if (products.length > 0){
      const route = {
        id: 'CartOrder',
        name: 'CartOrder',
        userId: this.userId,
        username: this.username,
        engagementToken: this.engagementToken,
        productsForOrder: products
      };

      this._next(route);
    }
  }

  _peakCart(){
    this.setState({peakCart: true});
  }

  _addToCart(stockProduct){
    this.state.productsForCheckout.set(stockProduct.product._id, stockProduct);
    this.setState({productsForCheckout: this.state.productsForCheckout});
  }

  _removeFromCart(stockProduct){
    this.state.productsForCheckout.delete(stockProduct.product._id);
    this.setState({productsForCheckout: this.state.productsForCheckout});
  }

  _getCartProducts(){
    const selected = [];
    this.state.productsForCheckout.forEach((v,k) => {
      selected.push(v);
    });
    console.log(selected);
    return selected;
  }

  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <Text style={{marginTop:30}}>SPACER</Text>

        <Modal transparent={true} visible={this.state.productDetail != null} animationType='fade'>
          <ProductDetailModalContent stockProduct={this.state.productDetail}
            closeHandler={() => {this.setState({productDetail: null})}}
          />
        </Modal>

        <Modal transparent={true} visible={this.state.peakCart} animationType='fade'>
          <CartPeakModalContent cartProducts={this._getCartProducts()}
            closeHandler={() => {this.setState({peakCart: false})}}
          />
        </Modal>

        <ListView
          dataSource={this.state.products}

          renderRow={ (stockProduct) => {
            return (
              <TouchableOpacity style={{margin:20}}
                onPress={() => { this._selectProduct(stockProduct);}}>
                <View style={styles.apInfo}>
                  <Image style={{width: 50, height: 50, borderRadius: 25}}
                    source={{uri: stockProduct.product.img}}/>
                  <View style={{flex:1}}>
                    <Text style={{marginLeft:15, fontSize: 15, fontWeight: 'bold'}}>
                      {_s.humanize(stockProduct.product.name)}:
                    </Text>
                    <Text style={{marginLeft:15, fontSize: 15}}>{_s.humanize(stockProduct.product.description)}</Text>
                  </View>
                  {
                    this.state.productsForCheckout.get(stockProduct.product._id)
                      ? <Icon name="check-circle" style={styles.selectedProductIcon}
                        allowFontScaling={true}
                        onPress={() => {this._removeFromCart(stockProduct);}}/>
                      : <Icon name="plus-circle" style={styles.nonSelectedProductIcon}
                        allowFontScaling={true}
                        onPress={() => {this._addToCart(stockProduct);}}/>
                  }
                </View>
              </TouchableOpacity>
            );
            }
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />

      {/*TODO Si pongo el if adentro del CartActionButton, le pinta no andar*/}
      {
        this._getCartProducts().length > 0
        ?
          <CartActionButton
            peakHandler={this._peakCart}
            orderHandler={this._placeOrder}
            checkoutHandler={this._checkout}
            />
          :
            <ActionButton buttonColor="#808080"
             position="right"
             onPress={()=>{}}
             icon={<Icon name='shopping-cart' size={30} style={{marginRight: 5}} color="#FFFFFF" />}/>
      }
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


module.exports = StoreContent;
