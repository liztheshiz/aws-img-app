import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './object-card.scss';

export class ObjectCard extends React.Component {
    // CUSTOM METHODS
    // Helper function to convert response data from GET request into a url
    blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = (e) => {
            callback(e.target.result);
        };
        a.readAsDataURL(blob);
    }

    // Gets thumbnail version of given object from S3 bucket
    getThumbnail() {
        const string = `thumbnails%2F${this.props.object.Key.substring(5)}`;
        axios.get(`http://ALB_DNS_ADDRESS/images/${string}`, { responseType: "blob" })
            .then((response) => {
                this.blobToDataURL(response.data, (dataurl) => {
                    this.setState({
                        imageUrl: dataurl,
                        isFetching: false
                    });
                });
            });
    }

    // LIFECYCLE METHODS
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: {},
            isFetching: true
        };
    }

    componentDidMount() {
        this.getThumbnail();
    }

    render() {
        const { object, showImage } = this.props;
        const { imageUrl, isFetching } = this.state;

        return (
            <Card className="object-card my-3">
                {!isFetching && <Card.Img variant="top" crossOrigin="anonymous" src={imageUrl ? imageUrl : null} />}
                {isFetching && <p className="mt-3" >Loading...</p>}
                <Card.Body>
                    <Card.Title className="fs-4">{object.Key.substring(5)}</Card.Title>
                    <Button className="object-button mt-2" variant="outline-dark" size="sm" onClick={() => showImage(object.Key)}>View file</Button>
                </Card.Body>
            </Card >
        );
    }
}

ObjectCard.propTypes = {
    object: PropTypes.shape({
        ETag: PropTypes.string.isRequired,
        Key: PropTypes.string.isRequired,
        LastModified: PropTypes.string.isRequired,
        Size: PropTypes.number.isRequired,
        StorageClass: PropTypes.string.isRequired
    }).isRequired,
    showImage: PropTypes.func.isRequired
}