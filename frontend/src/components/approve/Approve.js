import React,{Component} from 'react';
import {Form, Row, Col, Button, Card}from 'react-bootstrap';
import mapbox from 'mapbox-gl'
import * as d3 from "d3"
import turf from "@turf/turf"
import bbox from "@turf/bbox"

import Request from './Request'

var zoneToApprove = require('../../zoneToApprove.json');


export default class Approve extends Component{

    constructor (props) {
        super(props);
        this.state = {
            map : undefined,
        };

        this.rejectZone = this.rejectZone.bind(this);
        this.approveZone = this.approveZone.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this)

    }

    async componentDidMount() {
        mapbox.accessToken = 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA';

        var color = d3.schemeSet2;
        var map = new mapbox.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [
            14.038784600499525,
            49.29969274777156
            ],
            zoom: 2.7,
        });

        console.log('zoneToApprove', zoneToApprove);

        // Connect to contract

        // Pull all registered addresses

        // Pull all 3box spaces

        // get array of approved GeoJSON files



        // Load registered zones on map.
        await map.on('style.load', () => {


            this.props.registeredZones.forEach( (registeredZone, i) => {

            console.log(i, registeredZone)
            map.addSource(registeredZone.properties.id + '-source', {
                "type": 'geojson',
                'data': registeredZone
            });

            map.addLayer({
                'id': registeredZone.properties.id,
                'type': 'fill',
                'source': registeredZone.properties.id + '-source',
                'layout': {},
                'paint': {
                'fill-color': color[i],
                'fill-opacity': 0.4
                }
            }, "country-label");

            map.addLayer({
              'id': registeredZone.properties.id + '-border',
              'type': 'line',
              'source': registeredZone.properties.id + '-source',
              'layout': {},
              'paint': {
                'line-color': color[i],
                'line-width': 2
              }
            },  "state-label");
          });


          map.addSource('zone-to-approve-source', {
              "type": 'geojson',
              'data': zoneToApprove
          });

          map.addLayer({
              'id': 'zone-to-approve',
              'type': 'fill',
              'source': 'zone-to-approve-source',
              'layout': {},
              'paint': {
              'fill-color': "#ff6700",
              'fill-opacity': 0.4
              }
          },  "settlement-label");

          map.addLayer({
            'id': 'zone-to-approve-border',
            'type': 'line',
            'source': 'zone-to-approve-source',
            'layout': {},
            'paint': {
              'line-color': "#ff6700",
              'line-width': 2
            }
          }, "country-label");




        });

        this.setState({map : map});
        console.log("test: ", this.state.map)

        // Put them into turf objects

    }

    async rejectZone (e) {
      console.log(this.state.map)
      console.log("REJECT ZONE!")
    }

    async approveZone (e) {
      // this.state.map.
        // ^^
        console.log("APPROVE ZONE!")
    }

    // async

    render() {
        return (
            <div>
                <div id="main-map" style = {{"position":"absolute",}}></div>


                    {/* request zone name*/}
                    {/* request owner */}
                <div className = "overlay cardgroup">
                <Form className = "overlay">
                <h3>Review Zones</h3>

                    <Request approveZone = {this.approveZone} rejectZone = {this.rejectZone} map = {this.state.map} />
                  </Form>
                </div>
        </div>
        );
    }
}
