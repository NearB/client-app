'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-material-design';
import {MKSpinner} from 'react-native-material-kit';

import WifiClient from '../utils/WifiClient';

import MobileClient from '../utils/MobileClient';
const service = new MobileClient();


export default class WifiLearning extends Component {

  constructor(props) {
    super(props);

    if (props.username == null || props.location == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    this.username = props.username;
    this.locationName = props.location;


    this.wifi = new WifiClient('Stores', this.username);
    this.numberOfScans = 0;
    this.maxScans = 10;
    this.scanJob = null;

    this.state = {
      locationInfo: null,
      learning: true,
      onCancel: props.onCancel,
      onDone: props.onDone
    };

    this.startScan = this.startScan.bind(this);
    this.registerAp = this.registerAp.bind(this);
    this.cancel = this.cancel.bind(this);
    this.done = this.done.bind(this);
    this._stopScanJob = this._stopScanJob.bind(this);

  }

  cancel() {
    console.log("CANCEL");
    this._stopScanJob();
    this.state.onCancel();
  }

  done() {
    console.log("DONE");
    this._stopScanJob();
    console.log(this.state.locationInfo);
    this.state.onDone(this.state.locationInfo);
  }

  _stopScanJob() {
    this.numberOfScans = 0;
    this.setState({learning: false});
    clearInterval(this.scanJob);
  }

  startScan() {
    console.log("Starting scan");
    this.scanJob = setInterval(() => {
      if (!this.state.learning) {
        return;
      }

      if (this.numberOfScans == this.maxScans) {
        return this.done();
      }

      this.numberOfScans++;

      this.wifi.getLocationInfo(this.locationName)
        .then(info => {
          this.setState({locationInfo: info});
          this.registerAp();
        })
        .catch(err => {
          console.log(err);
        });
    }, 1000);
  }

  componentDidMount() {
    this.startScan();
  }

  registerAp() {
    console.log(this.state.locationInfo.toJSON());

    service.locations('PUT','', {
      body: JSON.stringify(this.state.locationInfo.toJSON())
    })
    .then((res) => {
      console.log(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <MKSpinner style={styles.spinner}/>
          <Button value="NORMAL RAISED" raised={true} onPress={this.state.onCancel} text='Cancel' theme='light'/>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  spinner: {
    width: 40,
    height: 40,
    margin: 20
  }
});


module.exports = WifiLearning;
