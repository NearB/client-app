import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  ListView,
  Modal,
} from 'react-native';

import _s from 'underscore.string';
import {Button} from 'react-native-material-design';

import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();
import NavLeft from '../common/NavigatorLeft';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


export default class CartCheckout extends Component {

  constructor(props) {
    super(props);

    this.cart = props.cart;
    this.userId = props.userId;
    this.username = props.username;
    this.engagementToken = props.engagementToken;

    console.log({
      cart: this.cart,
      userId: this.userId,
      username: this.username,
      engagementToken: this.engagementToken
    });

    const tokenParts = this.engagementToken.split(':');
    if (this.userId != tokenParts[0]){
      throw new Error(`Invalid token expected [${this.userId}] but was [${tokenParts[0]}]`);
    }

    this.storeId = tokenParts[1];
    // if (tokenParts.length > 3){
    //   this.originAdId = tokenParts[3];
    // }

    this.state = {
      products: ds.cloneWithRows([]),
      total: 0
    };

    this.rowIsWhite = false;
    this._checkout = this._checkout.bind(this);
    this._leaveStore = this._leaveStore.bind(this);
  }

  static _productsTotal(prods){
    return prods.map(a => +a.price * +a.quantity).reduce((a, b)=> a+b, 0);
  }

  componentDidMount() {
    service.carts('GET', `${this.cart._id}/products?engagement=${this.engagementToken}`)
      .then((res) => {
        const prods = res.data;
        const tot = CartCheckout._productsTotal(prods);
        this.setState({
          products: ds.cloneWithRows(prods),
          total: tot
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  _checkout(){
    service.carts('PUT', `${this.cart._id}?engagement=${this.engagementToken}`, {
        body: JSON.stringify({
          status: 'CHECKOUT'
        })
      })
      .then((res) => {
        console.log(res.data);
        this._leaveStore();
      })
      .catch((error) => {
        console.log(error);
      });

    this.props.navigator.pop();
  }

  _leaveStore(){
    const route = {
      id: 'UserHome',
      name: 'UserHome',
      userId: this.userId,
      username: this.username
    };

    console.log(route);
    this.props.navigator.resetTo(route);
  }

  renderScene(route, navigator) {
    this.rowIsWhite = false;
    return (
      <View style={styles.container}>
        <Text style={{marginTop:30}}>SPACER</Text>
        <ListView
          dataSource={this.state.products}

          renderRow={ (cartProduct) => {
            this.rowIsWhite = !this.rowIsWhite;
            const backColor = this.rowIsWhite ? '#FFFFFF' : '#FFF4E1';

            return (
              <View style={{backgroundColor: backColor}}>
                <View style={styles.apInfo}>
                  <Image style={{width: 50, height: 50, borderRadius: 25}}
                    source={{uri: cartProduct.product.img}}/>
                  <View style={{flex:1}}>
                    <Text style={{marginLeft:15, fontSize: 20, fontWeight: 'bold'}}>
                      {_s.humanize(cartProduct.product.name)}:
                    </Text>
                    <View style={{flex:1, flexDirection:'row'}}>
                      <Text style={{marginLeft:15, fontSize: 15}}>Price: ${cartProduct.price}</Text>
                      <Text style={{marginLeft:15, fontSize: 15}}>Quantity: {cartProduct.quantity}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
            }
          }
        />

      <View style={{margin:15}}>
        <Button value="NORMAL RAISED" raised={true}  onPress={this._checkout}
                      text={'Checkout   $' + this.state.total} theme='dark'/>
      </View>
      </View>
    );
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
  }
});
