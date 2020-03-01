import React,{Component} from 'react';
import {Row, Col, Button, Card}from 'react-bootstrap';
import mapbox from 'mapbox-gl'
import * as d3 from "d3"
import turf from "@turf/turf"
import bbox from "@turf/bbox"

import Request from './Request'

export default class Approve extends Component{

    constructor (props) {
        super(props);
        this.state = {
            map : undefined,
        };

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

        // Connect to contract

        // Pull all registered addresses

        // Pull all 3box spaces

        // get array of approved GeoJSON files


        // Load registered zones on map.
        map.on('style.load', () => {
            this.props.registeredZones.forEach( (registeredZone, i) => {

            console.log(i, registeredZone)
            map.addSource(registeredZone.properties.ID + '-source', {
                "type": 'geojson',
                'data': registeredZone
            });

            map.addLayer({
                'id': registeredZone.properties.ID,
                'type': 'fill',
                'source': registeredZone.properties.ID + '-source',
                'layout': {},
                'paint': {
                'fill-color': color[i],
                'fill-opacity': 0.4
                }
            });
            })
        });

        this.setState({map : map});
        // Put them into turf objects

    }
    render() {
        return (
            <div>
                <div id="main-map" style = {{"position":"absolute",}}></div>
                

                    {/* request zone name*/}
                    {/* request owner */}
                <div className = "overlay cardgroup">
                    <Request />
                    <Request />
                </div>
        </div>
        );
    }
}