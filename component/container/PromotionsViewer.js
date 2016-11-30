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
import Swiper from 'react-native-swiper';

import NavLeft from '../common/NavigatorLeft';
import NavBarButton from '../common/NavBarButton';
import WifiClient from '../../utils/WifiClient';
import MobileClient from '../../utils/MobileClient';
import {Button} from 'react-native-material-design';
import {MKCheckbox} from 'react-native-material-kit';

const service = new MobileClient();
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


class FilterModalContent extends Component {

  //checkChangeHandler, closeHandler, source
  constructor(props){
    super(props);
    this.onCheckedChange = props.checkChangeHandler;
    this.onClose = props.closeHandler;
    this.state = {
      elements: props.source
    }
  }

  render(){
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor:'#FFFFFF'}}>
              {
                this.state.elements.map(tag => {return(
                  <View style={{flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                    <MKCheckbox checked={true} onCheckedChange={(status) => {
                        this.onCheckedChange(status.checked, tag);
                      }}/>
                    <Text>{tag}</Text>
                  </View>
                );})
              }
              <Button text='CLOSE' onPress={this.onClose}
                style={{marginTop: 30}} raised={true} value="NORMAL RAISED" theme='light'/>
            </View>
        </View>
    );
  }
}

export default class PromotionsViewer extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.userId= props.userId;
    if (this.username == null || this.userId == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    this.wifi = new WifiClient("Clients", this.username);

    this.showFilters = false;

    console.log({
      username: this.username,
      userId: this.userId
    });

    this.tagFilter = [];
    this.tags = [];

    this.state = {
      promotions: [],
      currentTags:[],
      showFilters: false
    };

    this._fetchPromotions = this._fetchPromotions.bind(this);
    this._selectPromotion = this._selectPromotion.bind(this);
    this._setModalVisible = this._setModalVisible.bind(this);
    this._updateTags = this._updateTags.bind(this);
    this._next = this._next.bind(this);
  }

  componentDidMount() {
    this._fetchPromotions();
  }

  _setModalVisible(show){
    console.log("SHOW MODAL : "+ show);

    this._updateTags(this.tagFilter);
    this.setState({showFilters: show})
  }

  _fetchPromotions() {
    this.wifi.getNearestAp()
      .then((ap) => {
        console.log(ap);
        const qparams = encodeURI(ap.trackingInfo.fingerprints().join(','));
        service.promotions('GET', `?beacons=${qparams}&userId=${this.userId}`, {})
        .then(res => {
          this.setState({
            promotions: res.data
          });
          var tags = this.state.promotions.map(promotion => promotion.tags)
          if (tags.length > 0){
            tags = tags.reduce((a, b) => {
              return a.concat(b.filter(tag => !a.includes(tag)));
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
    this.tagFilter = tags;
    this.setState({currentTags: tags});
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
    console.log(this.tags);
    return (
      <View style={styles.container}>
        <Text style={{marginTop:20}}>SPACER</Text>

        <Modal
          transparent={true}
          visible={this.state.showFilters}
          >
          <FilterModalContent source={this.tags} closeHandler={() => {this._setModalVisible(false)}}
            checkChangeHandler={(isChecked, tag) => {
                            const included = this.tagFilter.includes(tag);
                            if (included && !isChecked){
                              console.log(`REMOVED TAG ${tag}`);
                              this.tagFilter = this.tagFilter.splice(this.tagFilter.indexOf(tag), 1);
                            } else if (!included && isChecked){
                              console.log(`ADDED TAG ${tag}`);
                              this.tagFilter.push(tag);
                            }
                          }}
          />
        </Modal>

        <Swiper showsButtons={true}>
          {shownPromotions.map(promotion => {
            return (
              <Image source={{uri: promotion.img}} style={styles.slide}>
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
              { return (
                <NavBarButton right={true} icon="filter" onPress={()=>{this._setModalVisible(true)}}/>
              ); },
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
    marginLeft: 80,
    color: 'white'
  },
  enabledNext: {
    color: '#FA8428',
    fontSize: 50,
    marginTop: 10
  },
  apInfo: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  }
});


module.exports = PromotionsViewer;
