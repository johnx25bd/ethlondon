import React, {Component, useState} from 'react';
import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ethers } from "ethers";
import Box from "3box";

import zoneArtifact from "../contracts/zonesABI.json";
import contractAddress from "../contracts/zonesAddress.json"


import NavBar from './NavBar'
import Register from './register/Register'
import Approve from './approve/Approve'
import Home from './Home'


var registeredZones = require('../registeredZones.json');

// import Approve from './approve/Approve'

class App extends Component {

  state = {
    needToAWeb3Browser: false,
    registeredZones: registeredZones,
    zoneToRegister: undefined,
  }

  constructor() {
    super();
    this.setZoneToRegister = this.setZoneToRegister.bind(this);
    this.readAllZone = this.readAllZone.bind(this);
    this.deleteZone = this.deleteZone.bind(this);

    this.registerZone = this.registerZone.bind(this)

    // doesnt work dont know why
    //this._initialiseEthers = this.initialiseEthers.bind(this);
   // this._logMetamaskError = this.logMetamaskError.bind(this);
  }

  async componentDidMount() {

    window.deleteZone = this.deleteZone;
    window.readAllZone = this.readAllZone;
    console.log(registeredZones);
    await this.getAddressFromMetaMask();

    // initilising with the contract
    this._intialiseEthers();

    if (this.state.accounts) {
      console.log("connected to provider!");
      const box = await Box.openBox(this.state.accounts[0], window.ethereum);
      // Sync 3Box
      await box.syncDone;
      // window.state = this.state;
      console.log("3Box synced");
      // const spaceList = await Box.listSpaces(this.state.accounts[0]);
      // console.log("number of space: " + spaceList.length);
      const space = await box.openSpace("zones");
      await space.syncDone;
      this.setState({ box, space });
      console.log("space synced! ", "zone");
    }

  }

  _intialiseEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    this._zones = new ethers.Contract(
      contractAddress.Zones,
      zoneArtifact.abi,
      this._provider.getSigner(0)
    );
    window.contract = this._zones;
  }

  async registerZone(zoneName, parentAcc, approved) {
    try{
      console.log('registering ', zoneName);
      const tx = await this._zones.registerZone(zoneName, parentAcc, false);
      await tx.wait();
      console.log(tx);
      // HAVEN'T figured out how to handle the emitted events...
      // not sure if this sollution works or not
      console.log("successfully registered", zoneName)

    } catch(error){
      this._logMetamaskError("Error registering for " + zoneName, error);
      console.error(error);
    }
  }



  _logMetamaskError(title, error) {
    if (error.data.message) {
      console.error(title + ":", error.data.message, error);
    } else {
      console.error(title, error);
    }
  }

  async setZoneToRegister(zone) {
    this.setState({zoneToRegister: zone});
  }

  async getAddressFromMetaMask() {
    if (typeof window.ethereum == "undefined") {
      this.setState({ needToAWeb3Browser: true });
    } else {
      window.ethereum.autoRefreshOnNetworkChange = false; //silences warning about no autofresh on network change
      const accounts = await window.ethereum.enable();
      this.setState({ accounts });
    }
  }

  async deleteZone(id) {
    const res = await this.state.space.public.remove(id);
    if (res) {
      console.log("delete success!");
    }
  };

  async readAllZone() {
    //fetch registered accounts from etheruem

    this.state.accounts.forEach(async addr => {
      const spaceData = await Box.getSpace(addr, "zones");
      console.log(spaceData);
    });
  };


  render() {
    if (this.state.needToAWeb3Browser) {
      return <h1>Please install metamask</h1>
    }
    console.log(this.state);

    return (
      <Router>
        <div className = "app">
          <NavBar />
          {this.state.needToAWeb3Browser && <h2>Please install metamask🦊</h2>}
          {(!this.state.needToAWeb3Browser && !this.state.accounts) && <h2>Connect MetaMask🤝</h2>}
            {this.state.accounts && (
              <Switch>
                <Route path="/register">
                  <Register
                    addr = {this.state.accounts[0]}
                    box = {this.state.box}
                    space = {this.state.space}
                    readAllZone = {this.readAllZone}
                    registerZone = {this.registerZone}
                    registeredZones = {this.state.registeredZones}
                    zoneToRegister = {this.state.zoneToRegister}
                    setZoneToRegister={this.setZoneToRegister}
                     />
                </Route>
                <Route path="/approve">
                  <Approve
                    addr = {this.state.accounts[0]}
                    box = {this.state.box}
                    space = {this.state.space}
                    readAllZone = {this.readAllZone}
                    registeredZones = {this.state.registeredZones}/>
                </Route>
                <Route path = '/'>
                  <Home />
                </Route>
              </Switch>
            )}

        </div>
      </Router>
    );
  }
}

export default App;
