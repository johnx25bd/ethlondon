import React, { Component } from "react";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import mapbox from "mapbox-gl";
import * as d3 from "d3";
import turf from "@turf/turf";
import bbox from "@turf/bbox";

//import Request from "./Request";

var zoneToApprove = require("../../zoneToApprove.json");

export default class Approve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: undefined
    };

    this.rejectZone = this.rejectZone.bind(this);
    this.approveZone = this.approveZone.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    mapbox.accessToken =
      "pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA";

    var color = d3.schemeSet2;
    var map = new mapbox.Map({
      container: "main-map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [14.038784600499525, 49.29969274777156],
      zoom: 2.7
    });

    await this.setState({ map: map });

    // Load registered zones on map.
    await this.state.map.on("style.load", () => {
      this.props.registeredZones.forEach((registeredZone, i) => {
        this.state.map.addSource(registeredZone.properties.id + "-source", {
          type: "geojson",
          data: registeredZone
        });

        this.state.map.addLayer(
          {
            id: registeredZone.properties.id,
            type: "fill",
            source: registeredZone.properties.id + "-source",
            layout: {},
            paint: {
              "fill-color": color[i],
              "fill-opacity": 0.4
            }
          },
          "country-label"
        );

        this.state.map.addLayer(
          {
            id: registeredZone.properties.id + "-border",
            type: "line",
            source: registeredZone.properties.id + "-source",
            layout: {},
            paint: {
              "line-color": color[i],
              "line-width": 2
            }
          },
          "state-label"
        );
      });

      this.state.map.addSource("zone-to-approve-source", {
        type: "geojson",
        data: zoneToApprove
      });

      this.state.map.addLayer(
        {
          id: "zone-to-approve",
          type: "fill",
          source: "zone-to-approve-source",
          layout: {},
          paint: {
            "fill-color": "#ff6700",
            "fill-opacity": 0.4
          }
        },
        "settlement-label"
      );

      this.state.map.addLayer(
        {
          id: "zone-to-approve-border",
          type: "line",
          source: "zone-to-approve-source",
          layout: {},
          paint: {
            "line-color": "#ff6700",
            "line-width": 2
          }
        },
        "country-label"
      );
    });

    // Put them into turf objects
  }

  async rejectZone(e) {
    this.props.zonesHandler(true);
    this.state.map.setPaintProperty("zone-to-approve", "fill-color", "red");
    this.state.map.setPaintProperty("zone-to-approve", "fill-opacity", 1.0);
    this.state.map.setPaintProperty(
      "zone-to-approve-border",
      "line-color",
      "darkred"
    );

    d3.select("#zone-to-register")
      .classed("rejected", true)
      .classed("approved", false);

    d3.select("#approve-zone")
      .classed("btn-outline-success", true)
      .classed("btn-success", false);

    d3.select("#reject-zone")
      .classed("btn-outline-danger", false)
      .classed("btn-danger", true);

    // Call up metamask <<
  }

  async approveZone(e) {
    e.preventDefault();
    this.props.zonesHandler(false);

    d3.select('#button-group')
    .classed('btn-primary', false)
    .classed('btn-outline-primary', true)
    .html("<div class='spinner-border' role='status'><span class='sr-only' style='height:10px;'>Loading...</span></div>... registering");

    await this.props.registerZone("approve","0xD07FC0cb1cb95519cEBbAfa1929919a7DB602d5B",true,"#status-holder","#button-group")
    this.state.map.setPaintProperty("zone-to-approve", "fill-color", "#008000");
    this.state.map.setPaintProperty("zone-to-approve", "fill-opacity", 1.9);
    this.state.map.setPaintProperty(
      "zone-to-approve-border",
      "line-color",
      "#008000"
    );

    d3.select("#zone-to-register")
      .classed("approved", true)
      .classed("rejected", false);

    d3.select("#approve-zone")
      .classed("btn-outline-success", false)
      .classed("btn-success", true);

    d3.select("#reject-zone")
      .classed("btn-outline-danger", true)
      .classed("btn-danger", false);

    // call up metamask <<
  }

  // async

  render() {
    console.log("when rendered", this.state.map);
    return (
      <div>
        <div id="main-map" style={{ position: "absolute" }}></div>

        {/* request zone name*/}
        {/* request owner */}
        <div className="overlay cardgroup">
          <Form className="overlay">
            <h3>Review Zones</h3>

            <Card id='zone-to-register' data-zone-id='zone-to-register' border="primary" className="zone-review">
                <Card.Header>LONDON</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <strong>Registrant</strong> : Greater London Authority <br />
                        <strong>Address</strong> : <a href="http://ropsten.etherscan.io/address/0x77DB10B97bbcE20656d386624ACb5469E57Dd21b" target="_blank">london.eth</a>
                    </Card.Text>
                    <Row id = "button-group" >
                        <Button id='approve-zone' as={Col} variant = "success" className = "button" onClick = {this.approveZone}>
                            Approve
                        </Button>
                        <Button id='reject-zone' as={Col} variant = "danger" className = "button" onClick = {this.rejectZone}>
                            Reject
                        </Button>
                        
                    </Row>
                    <Row id = "status-holder">
                    </Row>
                </Card.Body>
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}
