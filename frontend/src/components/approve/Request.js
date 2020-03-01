import React,{Component} from 'react';
import {Row, Col, Button, Card}from 'react-bootstrap';
import * as d3 from 'd3'

export default class Request extends Component {

    render() {
        return(
            <Card id='zone-to-register' data-zone-id='zone-to-register' border="primary" className="zone-review">
                <Card.Header>London Congestion Zone</Card.Header>
                <Card.Body>
                    <Card.Text>
                        Registrant : Greater London Authority
                    </Card.Text>
                    <Row>
                        <Button id='approve-zone' as={Col} variant = "success" className = "button" onClick = {this.props.approveZone}>
                            Approve
                        </Button>
                        <Button id='reject-zone' as={Col} variant = "danger" className = "button" onClick = {this.props.rejectZone}>
                            Reject
                        </Button>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}
