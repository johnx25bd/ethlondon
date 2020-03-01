import React, { Component, useState } from "react";
import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import Box from "3box";
import * as d3 from 'd3'

import zoneArtifact from "../contracts/zonesABI.json";
import contractAddress from "../contracts/zonesAddress.json";

import NavBar from "./NavBar";
import Register from "./register/Register";
import Approve from "./approve/Approve";
import Home from "./Home";

var registeredZones = require("../registeredZones.json");

// import Approve from './approve/Approve'

class App extends Component {
  state = {
    needToAWeb3Browser: false,
    registeredZones: registeredZones,
    zoneToRegister: undefined
  };

  constructor() {
    super();
    this.setZoneToRegister = this.setZoneToRegister.bind(this);
    this.readAllZone = this.readAllZone.bind(this);
    this.deleteZone = this.deleteZone.bind(this);
    this.zonesHandler = this.zonesHandler.bind(this);
    this.registerZone = this.registerZone.bind(this);
    this.readAddedZone = this.readAddedZone.bind(this);
    // doesnt work dont know why
    //this._initialiseEthers = this.initialiseEthers.bind(this);
    // this._logMetamaskError = this.logMetamaskError.bind(this);
  }

  async componentDidMount() {
    window.deleteZone = this.deleteZone;
    window.readAllZone = this.readAllZone;
    window.read = this.readAddedZone;
    // console.log(registeredZones);
    await this.getAddressFromMetaMask();

    // initilising with the contract
    this._intialiseEthers();

    if (this.state.selectedAddress) {
      console.log("connected to provider!");
      const box = await Box.openBox(
        this.state.selectedAddress,
        window.ethereum
      );
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
    window._provider = this._provider;
    this.setState({
      selectedAddress: this._provider._web3Provider.selectedAddress
    });
  }

  async registerZone(zoneName, parentAcc, approved,selector_1, selector_2) {
    try {
      console.log("registering ", zoneName);
      const tx = await this._zones.registerZone(zoneName, parentAcc, false);
      await tx.wait();
      console.log(tx);
      // HAVEN'T figured out how to handle the emitted events...
      // not sure if this sollution works or not
      console.log("successfully registered", zoneName);

      d3.select(selector_1)
        .append('a')
          .attr('href', 'https://ropsten.etherscan.io/tx/' + tx.hash)
          .attr('target', '_blank')
          .attr('id', 'view-on-etherscan')
          .classed('btn-success', true)
          .text('View on Etherscan')
          


      d3.select(selector_2)
        .remove()


    } catch (error) {
      this._logMetamaskError("Error registering for " + zoneName, error);
      console.error(error);
    }
  }

  _logMetamaskError(title, error) {
    if (error) {
      console.error(error);
    } else {
      console.error(title, error);
    }
  }

  async setZoneToRegister(zone) {
    this.setState({ zoneToRegister: zone });
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
  }

  async readAllZone() {
    //fetch registered accounts from etheruem
    let res = [];
    await this.state.accounts.forEach(async addr => {
      const spaceData = await Box.getSpace(addr, "zones");
      res.push(spaceData);
    });
    console.log("reading state");
    console.log(this.state.zones);
    return res;
  }

  async readAddedZone() {
    const spaceData = await Box.getSpace(
      "0x77DB10B97bbcE20656d386624ACb5469E57Dd21b",
      "zones"
    );
    console.log(spaceData);
  }

  async zonesHandler(toDelete) {
    const spaceData = await Box.getSpace(
      "0x77DB10B97bbcE20656d386624ACb5469E57Dd21b",
      "zones"
    );
    if (toDelete) {
      for (let key in spaceData) {
        await this.deleteZone(key);
      }
      console.log("SHULD BE DELETED");
    }
    console.log("zonesHandler!");
  }

  render() {
    if (this.state.needToAWeb3Browser) {
      return <h1>Please install metamask</h1>;
    }
    console.log(this.state);

    return (
      <Router>
        <div className="app">
          <NavBar />
          {this.state.needToAWeb3Browser && <h2>Please install metamask🦊</h2>}
          {!this.state.needToAWeb3Browser && !this.state.accounts && (
            <h2>Connect MetaMask🤝</h2>
          )}
          {this.state.selectedAddress && (
            <Switch>
              <Route path="/register">
                <Register
                  addr={this.state.selectedAddress}
                  box={this.state.box}
                  space={this.state.space}
                  readAllZone={this.readAllZone}
                  registerZone={this.registerZone}
                  registeredZones={this.state.registeredZones}
                  zoneToRegister={this.state.zoneToRegister}
                  setZoneToRegister={this.setZoneToRegister}
                  zonesHandler={this.state.zonesHandler}
                />
              </Route>
              <Route path="/approve">
                <Approve
                  addr={this.state.selectedAddress}
                  box={this.state.box}
                  space={this.state.space}
                  readAllZone={this.readAllZone}
                  registeredZones={this.state.registeredZones}
                  zonesHandler={this.zonesHandler}
                  registerZone={this.registerZone}
                />
              </Route>
              <Route path="/">
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
