'use strict';

import {NativeModules} from 'react-native';
import _ from 'underscore';
import _s from 'underscore.string';
import {TrackingInformation, FingerPrint} from '../model/TrackingInformation';

const WifiManager = NativeModules.WifiManager;

export default class WifiClient {

  constructor(group, user) {
    this.group = group;
    this.user = user;
  }

  getLocationInfo(location) {
    return new Promise((success, err) => {
      this._getScanResults((apData, fingerprints) => {
        success(new TrackingInformation(this.group, this.user, location, Date.now(), fingerprints));
      }, err);
    });
  }

  getNearestAp() {
    return new Promise((success, err) => {
      this._getScanResults((apData, fingerprints) => {
        success({
          name: _s.humanize(apData[0].SSID),
          SSID: apData[0].SSID,
          trackingInfo: new TrackingInformation(this.group, this.user, _s.humanize(apData[0].SSID), Date.now(), fingerprints)
        });
      }, err);
    });
  }

  getAccessPoints() {
    return new Promise((success, err) => {
      this._getScanResults((apData, fingerprints) => {

        const accessPoints = _.map(apData, (ap) => {
          return {
            name: _s.humanize(ap.SSID),
            SSID: ap.SSID,
            trackingInfo: new TrackingInformation(this.group, this.user, _s.humanize(ap.SSID), Date.now(), fingerprints)
          };
        });

        success(accessPoints);
      }, err);
    });
  }

  _getScanResults(success, err) {
    this.scan();

    WifiManager.getScanResults(
      (rawScan) => {
        let apData = _.map(_.values(rawScan), (ap) => {
          return JSON.parse(ap)
        });

        apData = _.sortBy(apData, (ap) => {
          return -ap.level;
        });

        const fingerprints = _.map(apData, (ap) => {
          return new FingerPrint(ap.BSSID, ap.level);
        });

        success(apData, fingerprints);
      },
      (msg) => {
        err(msg);
      }
    );
  }

  scan() {
    console.log("Starting scan");
    WifiManager.startScan(
      () => {
        console.debug("Successful scan start");
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

}

module.exports = WifiClient;
