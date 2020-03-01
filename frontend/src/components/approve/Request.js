import React,{Component} from 'react';
import {Row, Col, Button, Card}from 'react-bootstrap';

export default class Request extends Component {
    render() {
        return(
            <Card border="primary" style = {{"margin" : "2em",}}>
                <Card.Header>Zone Name</Card.Header>
                <Card.Body>
                    <Card.Text>
                        Registrant : Tony
                    </Card.Text>
                    <Row>
                        <Button as={Col} variant = "success" className = "button">
                            Approve
                        </Button>
                        <Button as={Col} variant = "danger" className = "button">
                            Reject
                        </Button>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}