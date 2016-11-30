"use strict";

export class FingerPrint {

  constructor(mac, rssi) {
    this.mac = mac;
    this.rssi = rssi;
  }

  toString(){
    return `${this.mac}=${this.rssi}`;
  }

  toJSON() {
    return {
      mac: this.mac,
      rssi: Number(this.rssi)
    };
  }
}

export class TrackingInformation {

  constructor(group, user, place, time, fingerprints) {
    this.group = group;
    this.username = user;
    this.location = place;
    this.time = time;
    this.wifiFingerprint = fingerprints;

    this.fingerprints.bind(this);
    this.toJSON.bind(this);
  }

  fingerprints(){
    return this.wifiFingerprint.map(f => f.toString());
  }

  toJSON() {
    return {
      group: this.group,
      username: this.username,
      location: this.location,
      time: this.time,
      "wifi-fingerprint": this.wifiFingerprint
    };
  }
}
