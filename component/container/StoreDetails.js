import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ToolbarAndroid,
  Navigator,
  ListView
} from 'react-native';

import {MKTextField, MKButton} from 'react-native-material-kit';
import _s from 'underscore.string';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from 'react-native-material-design';
import ActionButton from 'react-native-action-button';
import NavLeft from '../common/NavigatorLeft';
import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class StoreDetails extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.store = props.store;

    if (this.username == null || this.store == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    console.log(this.store);
    console.log({username: this.username});

    this.state = {
      locations: ds.cloneWithRows(this.store.locations),
      addingLocation: false
    };

    this._selectLocation = this._selectLocation.bind(this);
    this._addLocation = this._addLocation.bind(this);
  }

  _selectLocation(loc){
    this.setState({selected: loc});
    this._next();
  }

  _addLocation(){
    this.setState({addingLocation: true});
    this._next();
  }

  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <Text style={{marginTop:40}}>SPACER</Text>
        <View style={styles.apInfo}>
          <Icon name="user" size={20} style={{marginBottom: 10, marginRight: 10}}/>
          <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 10}}> Owner: </Text>
          <Text style={styles.data}>{this.username}</Text>
        </View>
        <View style={styles.apInfo}>
          <Icon name="home" size={20} style={{marginBottom: 10, marginRight: 10}}/>
          <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 10}}> Address: </Text>
          <Text style={styles.data}>{this.store.address}</Text>
        </View>
        <ListView
          dataSource={this.state.locations}
          initialListSize={this.store.locations.length}
          renderRow={ (rowData) => {
            return (<TouchableOpacity style={{height: 30, margin:20}}
              onPress={this._selectLocation}>
              <View style={styles.apInfo}>
                <Icon name='map-marker' size={20} style={{marginRight: 15}}/>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>{_s.humanize(rowData.split(':')[1])}</Text>
              </View>
            </TouchableOpacity>);
            }
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
        <ActionButton buttonColor="#FA8428" position="right">
            <ActionButton.Item titleBgColor='#F5FCFF' buttonColor='#9b59b6'
                textStyle={{fontSize: 15, fontWeight: 'bold'}}
                onPress={this._addLocation}>
              <Icon name="map-marker" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            {/*
              <ActionButton.Item titleBgColor='#F5FCFF' buttonColor='#3498db'
                textStyle={{fontSize: 15, fontWeight: 'bold'}}
                onPress={this._deleteStore}>
                <Icon name="trash-o" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            */}
          </ActionButton>
      </View>
    );
  }

  _next() {
    const route = {
      id: 'AddLocation',
      name: 'AddLocation',
      username: this.username,
      store: this.store
    };
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
                    <Text style={styles.barTitle}>{this.store.name}</Text>
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
    marginLeft: 105,
    marginTop: 12,
    color: 'white'
  },
  enabledNext: {
    color: '#FA8428',
    fontSize: 50,
    marginTop: 10
  },
  disabledNext: {
    color: '#808080',
    fontSize: 50,
    marginTop: 10
  },
  locationName: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 10
  },
  data: {
    color: '#656565',
    marginBottom: 10
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
    margin: 10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});


module.exports = StoreDetails;
