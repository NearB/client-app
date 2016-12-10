import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Modal
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import NavLeft from '../common/NavigatorLeft';
import WifiClient from '../../utils/WifiClient';
import MobileClient from '../../utils/MobileClient';

const service = new MobileClient();

export default class PromotionsViewer extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.userId= props.userId;
    this.wifi = new WifiClient("Clients", this.username);

    this.showFilters = false;
    this.tags = [];

    this.state = {
      promotions: [],
      currentTags:[],
      showFilters: false
    };

    this._fetchPromotions = this._fetchPromotions.bind(this);
    this._selectPromotion = this._selectPromotion.bind(this);
    this._updateTags = this._updateTags.bind(this);
    this._next = this._next.bind(this);
  }

  componentDidMount() {
    this._fetchPromotions();
  }

  _fetchPromotions() {
    this.wifi.getNearestAp()
      .then((ap) => {
        const beacons = encodeURI(ap.trackingInfo.fingerprints().join(','));
        service.promotions('GET', `?beacons=${beacons}&userId=${this.userId}`, {})
        .then(res => {
          this.setState({
            promotions: res.data
          });
          var tags = this.state.promotions.map(promotion => promotion.tags);
          if (tags.length > 0){
            tags = tags.reduce((a, b) => {
              return a.concat(b.filter(tag => !a.includes(tag)), []);
            });
          }

          this.tags = tags;
          this._updateTags(tags);
        }).catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _updateTags(tags) {
    this.setState({currentTags: tags});
    this.forceUpdate();
  }

  _selectPromotion(promotion){
    console.log(promotion);
    const route = {
      id: 'StoreContent',
      name: 'StoreContent',
      userId: this.userId,
      username: this.username,
      engagementToken: promotion.engagementToken
    };

    this._next(route);
  }

  renderScene(route, navigator) {
    const shownPromotions = [];
    this.state.promotions.forEach(promotion => {
      if (promotion.tags.some(tag => this.state.currentTags.includes(tag))){
        shownPromotions.push(promotion);
      }
    });

    return (
      <View style={styles.container}>
        <Text style={{marginTop:20}}>SPACER</Text>

        <Swiper showsButtons={true}>
          {shownPromotions.map(promotion => {
            return (
              <Image key={promotion._id} source={{uri: promotion.img}} style={styles.slide}>
                  <View style={{flex:1}}>
                    <Text style={styles.promotionTitle}>{promotion.name}</Text>
                    <View style={{flex:0.8, justifyContent:'flex-end', alignItems:'center',
                        marginBottom:100}}>
                        <Icon name="check-circle" style={{ color: '#41EC22', fontSize: 100}}
                          allowFontScaling={true}
                          onPress={() => {this._selectPromotion(promotion);}}/>
                    </View>
                  </View>
              </Image>
            );
          })}
        </Swiper>
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
              {return null;},
              Title: (route, navigator, index, navState) =>
              { return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.barTitle}>Promotions</Text>
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
  promotionTitle: {
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    fontFamily: 'sans-serif-thin',
    fontWeight:'bold',
    color: '#FFFFFF',
    fontSize: 80,
    backgroundColor: 'rgba(204, 106, 29, 0.6)'
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
    marginLeft: 80,
    color: 'white'
  },
  slide: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  }
});


module.exports = PromotionsViewer;
