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

import ProductDetailModalContent from './ProductDetailModalContent';
import CartPeakModalContent from './CartPeakModalContent';

import MobileClient from '../../utils/MobileClient';
import NavLeft from '../common/NavigatorLeft';

const service = new MobileClient();
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
      productsForOrder: new Map(),
      productDetail: null,
      peakOrder: false,
      storeName: ''
    };

    this.rowIsWhite = false;

    this._fetchProducts = this._fetchProducts.bind(this);
    this._selectProduct = this._selectProduct.bind(this);
    this._initCart = this._initCart.bind(this);
    this._checkout = this._checkout.bind(this);
    this._peakOrder = this._peakOrder.bind(this);
    this._placeOrder = this._placeOrder.bind(this);
    this._removeFromCart = this._removeFromCart.bind(this);
    this._addToCart = this._addToCart.bind(this);
    this._getOrderProducts = this._getOrderProducts.bind(this);
    this._renderActionButton = this._renderActionButton.bind(this);
    this._next = this._next.bind(this);
  }

  componentDidMount() {
    this._getStoreName();
    this._fetchProducts();
    this._initCart();
  }

  _getStoreName() {
    service.stores('GET', `${this.storeId}`)
        .then((res) => {
          this.setState({
            storeName: res.data.name
          });
        })
        .catch((error) => {
          console.log(error);
        });
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
    if (this.cart != null){
      return;
    }

    var resolver;
    if (this.props.cartId != null){
      resolver = service.carts('GET', `${this.props.cartId}?engagement=${this.engagementToken}`);
    } else {
      resolver = service.carts('POST', `?engagement=${this.engagementToken}`);
    }

    resolver.then((res) => {
          this.cart = res.data;
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
      const route = {
        id: 'CartCheckout',
        name: 'CartCheckout',
        cart: this.cart,
        userId: this.userId,
        username: this.username,
        engagementToken: this.engagementToken
      };

      this.state.productsForOrder.clear();
      this._next(route);
  }

  _placeOrder(){
    const products = this._getOrderProducts();
    if (products.length > 0){
      const route = {
        id: 'CartOrder',
        name: 'CartOrder',
        cart: this.cart,
        userId: this.userId,
        username: this.username,
        engagementToken: this.engagementToken,
        productsForOrder: products
      };

      this.state.productsForOrder.clear();
      this._next(route);
    }
  }

  _addToCart(stockProduct){
    this.state.productsForOrder.set(stockProduct.product._id, stockProduct);
    this.setState({productsForOrder: this.state.productsForOrder});
  }

  _removeFromCart(stockProduct){
    this.state.productsForOrder.delete(stockProduct.product._id);
    this.setState({productsForOrder: this.state.productsForOrder});
  }

  _peakOrder(){
    this.setState({peakOrder: true});
  }

  _getOrderProducts(){
    const selected = [];
    this.state.productsForOrder.forEach((v, k) => {
      selected.push(v);
    });
    return selected;
  }

  renderScene(route, navigator) {
    this.rowIsWhite = false;

    return (
      <View style={styles.container}>
        <Text style={{marginTop:30}}>SPACER</Text>

        <Modal transparent={true} visible={this.state.productDetail != null} animationType='fade'>
          <ProductDetailModalContent stockProduct={this.state.productDetail}
            closeHandler={() => {this.setState({productDetail: null})}}
          />
        </Modal>

        <Modal transparent={true} visible={this.state.peakOrder} animationType='fade'>
          <CartPeakModalContent cartProducts={this._getOrderProducts()}
                                closeHandler={() => {this.setState({peakOrder: false})}}
          />
        </Modal>

        <ListView
          dataSource={this.state.products}

          renderRow={ (stockProduct) => {

            this.rowIsWhite = !this.rowIsWhite;
            const backColor = this.rowIsWhite ? '#FFFFFF' : '#FFF4E1';

            return (
              <TouchableOpacity
                onPress={() => { this._selectProduct(stockProduct);}}>
                <View style={{backgroundColor:backColor}}>
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
                      this.state.productsForOrder.get(stockProduct.product._id)
                        ? <Icon name="check-circle" style={styles.selectedProductIcon}
                          allowFontScaling={true}
                          onPress={() => {this._removeFromCart(stockProduct);}}/>
                        : <Icon name="plus-circle" style={styles.nonSelectedProductIcon}
                          allowFontScaling={true}
                          onPress={() => {this._addToCart(stockProduct);}}/>
                    }
                  </View>
                </View>
              </TouchableOpacity>
            );
            }
          }
        />

        {this._renderActionButton()}

      </View>
    );
  }

  _renderActionButton(){
    const items = [];
    if (this._getOrderProducts().length > 0){
      return (
        <ActionButton buttonColor="#FA8428"
             position="right"
             icon={<Icon name='shopping-cart' size={30} style={{marginRight: 5}} color="#FFFFFF" />}>
              <ActionButton.Item
                  titleBgColor='#F5FCFF'
                  buttonColor='#53B3F9'
                  title='Peak Order'
                  textStyle={{fontSize: 15, fontWeight: 'bold'}}
                  onPress={this._peakOrder}>
                    <Icon name="search" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item
                  titleBgColor='#F5FCFF'
                  buttonColor='#5367F9'
                  title='Order'
                  textStyle={{fontSize: 15, fontWeight: 'bold'}}
                  onPress={this._placeOrder}>
                    <Icon name="hand-pointer-o" style={{fontSize: 24, height: 25, color: 'white', }} />
              </ActionButton.Item>
            </ActionButton>
      );
    } else {
      return (
        <ActionButton buttonColor="#FA8428"
             position="right"
             icon={<Icon name='shopping-cart' size={30} style={{marginRight: 5}} color="#FFFFFF" />}>
              <ActionButton.Item buttonColor='#9b59b6'
                  title='Checkout'
                  titleBgColor='#F5FCFF'
                  textStyle={{fontSize: 15, fontWeight: 'bold'}}
                  onPress={this._checkout}>
                    <Icon name="dollar" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            </ActionButton>
      );
    }
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
                    <Text style={styles.barTitle}>{this.state.storeName}</Text>
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


module.exports = StoreContent;
