import React,{Component} from 'react';
import {Form, Button}from 'react-bootstrap';
import FileUploader from './FileUploader'
import mapbox from 'mapbox-gl'
import * as d3 from "d3"
import turf from "@turf/turf"
import bbox from "@turf/bbox"


export default class Register extends Component {

    constructor (props) {
        super(props);
        this.state = {
            map : undefined,
            zoneName : '',
        };

        this.addPolygonToMap = this.addPolygonToMap.bind(this);
        this.registerPolygon = this.registerPolygon.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange (e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
        [name]: value
        });

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
                  'fill-opacity': 0.2
                }
            },  "country-label");


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
          })
        });

        this.setState({map : map});
        // Put them into turf objects

    }

    async addPolygonToMap (polygon) {

      this.state.map.addSource('zone-to-register-source', {
          "type": 'geojson',
          'data': polygon
      });

      this.state.map.addLayer({
          'id': 'zone-to-register',
          'type': 'fill',
          'source': 'zone-to-register-source',
          'layout': {},
          'paint': {
          'fill-color': "#ff6700",
          'fill-opacity': 0.4
          }
      },  "settlement-label");

      this.state.map.addLayer({
        'id': 'zone-to-register-border',
        'type': 'line',
        'source': 'zone-to-register-source',
        'layout': {},
        'paint': {
          'line-color': "#ff6700",
          'line-width': 2
        }
      }, "country-label");


      this.state.map.fitBounds(bbox(polygon),
          {padding: {
            left:150,
            right: 500,
            top: 150,
            bottom: 150
          }});


      // if polygon.parent is not null, add parent wallet address to
    }


    async registerPolygon(e) {
        e.preventDefault();

        // call registerZone on ethers contract ...

        await this.props.space.public.set(this.state.zoneName, JSON.stringify(this.props.zoneToRegister, null, 2))
        .then(console.log("save success"));

        this.props.readAllZone();

        this.setState({ zoneName: ''});

    }



    render() {
        return (
            <div>
                <div id="main-map" style = {{"position":"absolute",}}>
                    {/* RegisterMap */}
                </div>
                <Form className = "overlay">
                <h3>Register a zone</h3>

                    <Form.Label className = "text-primary mt-3 mb-0">
                        Zone Polygon
                    </Form.Label>
                    <FileUploader registeredZones = {this.props.registeredZones} setZoneToRegister={this.props.setZoneToRegister} addPolygonToMap = {this.addPolygonToMap} />

                    <Form.Group controlId="zoneName">
                        <Form.Label className = "text-primary mt-3 mb-0">
                            Zone Name
                        </Form.Label>
                        <Form.Control type="text" placeholder="Enter your zone name here" name = "zoneName" onChange = {this.handleChange} />

                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.Label className = "text-primary mt-3 mb-0">
                            Ethereum Wallet Address
                        </Form.Label>
                        <Form.Control readOnly className = "text-muted" placeholder = {this.props.addr} />

                    </Form.Group>

                    <Button variant="primary" type="submit" style = {{float: "right"}} onClick={this.registerPolygon}>
                        Register zone
                    </Button>
                </Form>

        </div>
        );
    }
}
