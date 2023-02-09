import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { ObjectsList } from '../objects-list/objects-list';

import axios from 'axios';

export function AwsView() {
    const [displayList, setDisplayList] = useState(false);
    const [objects, setObjects] = useState([]);

    // Uploads given file to AWS bucket on submit
    // >>> This triggers Lambda function to create a thumbnail
    const handleS3Submit = (e) => {
        // Keeps page from reloading
        e.preventDefault();

        let formData = new FormData();
        selectedFile = document.getElementById('input-file').files[0];
        formData.append('image', selectedFile);

        axios.post('http://ALB_DNS_ADDRESS/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => { alert('Image successfully posted! Page will now reload.'); window.location.reload() });
    }

    // Gets list of objects in bucket on submit
    const handleListSubmit = (e) => {
        // keeps page from reloading
        e.preventDefault();

        console.log('handling submit');
        // Get objects, then pass array of only original images with orig/ prefix to ObjectsList
        axios.get('http://ALB_DNS_ADDRESS/images')
            .then((res) => res.data.Contents.filter((m) => m.Key.startsWith('orig/')))
            .then((array) => setObjects(array))
            .then(() => setDisplayList(true));
    }

    return (
        <Container className="aws-view mt-5">
            <Row className="justify-content-sm-center mt-3">
                <Col sm={8} md={6} lg={4}>
                    <h2>AWS File Upload</h2>
                    <Form className="mt-4">
                        <Form.Group>
                            <Form.Control id="input-file" type="file" name="image" />
                        </Form.Group>
                        <Button className="mt-4" variant="dark" size="sm" type="submit" onClick={handleS3Submit}>Upload</Button>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-sm-center mt-5">
                <Col className="text-center">
                    <Button className="mt-2" variant="outline-dark" size="lg" type="submit" onClick={handleListSubmit}>Load Bucket Contents</Button>
                </Col>
            </Row>
            {displayList && <div>
                <Row className="justify-content-sm-center mt-4">
                    <Col sm={8} md={6} lg={4}>
                        <h1>Objects:</h1>
                    </Col>
                </Row>
                <ObjectsList objects={objects} />
            </div>}
        </Container>
    );
}