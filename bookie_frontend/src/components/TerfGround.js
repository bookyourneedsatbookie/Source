import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import Loader from './Loader';

export default function TerfGround() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [SelectedDate, setSelectedDate] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [load, setLoad] = useState(true);
    const [terfDetails, setterfDetails] = useState([]);
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);

    const [selectedTerfDetails, setSelectedTerfDetails] = useState({
        selectedMrgSlots: [],
        selectedEvgSlots: [],
        length: ""
    });

    useEffect(() => {
        if (selectedTerfDetails?.selectedEvgSlots?.length > 0 || selectedTerfDetails?.selectedMrgSlots?.length > 0) {
            setSelectedTerfDetails((prev) => ({
                ...prev,
                length: selectedTerfDetails?.selectedEvgSlots?.length + selectedTerfDetails?.selectedMrgSlots?.length
            }));
        }
    }, [selectedTerfDetails?.selectedEvgSlots, selectedTerfDetails?.selectedMrgSlots]);

    const handleShow = (item) => {
        setShow(true);
        if (item) {
            setSelectedTerfDetails((prev) => ({
                ...prev,
                item
            }));
        }
    };

    const handleShow2 = () => {
        setShow(false);
        setShow2(true);
    };

    const handleMrgSlotClick = (item) => {
        if (!selectedTerfDetails?.selectedMrgSlots?.includes(item)) {
            setSelectedTerfDetails((prev) => ({
                ...prev,
                selectedMrgSlots: [...selectedTerfDetails?.selectedMrgSlots, item]
            }));
        } else {
            setSelectedTerfDetails((prev) => ({
                ...prev,
                selectedMrgSlots: selectedTerfDetails?.selectedMrgSlots.filter(slot => slot !== item)
            }));
        }
    };

    const handleEvgSlotClick = (item) => {
        if (!selectedTerfDetails?.selectedEvgSlots?.includes(item)) {
            setSelectedTerfDetails((prev) => ({
                ...prev,
                selectedEvgSlots: [...selectedTerfDetails?.selectedEvgSlots, item]
            }));
        } else {
            setSelectedTerfDetails((prev) => ({
                ...prev,
                selectedEvgSlots: selectedTerfDetails?.selectedEvgSlots.filter(slot => slot !== item)
            }));
        }
    };

    const getDashboard = (userId) => {
        setLoad(true);
        axios.get(`http://localhost:3000/getAllTerfs/${userId}`, {
            headers: {
                Authorization: token && 'Bearer ' + token
            }
        }).then(res => {
            if (res.status === 200) {
                const data = res.data.terf_details.map(turf => ({
                    ...turf,
                    mrngSlots: turf.mrngSlots.split(','),
                    evngSlots: turf.evngSlots.split(',')
                }));
                setterfDetails(data);
                setLoad(false);
            }
        }).catch(e => console.log(e));
    };

    useEffect(() => {
        getDashboard(userId);
    }, [userId]);

    const isSlotSelected = (slot, type) => {
        if (type === 'morning') {
            return selectedTerfDetails?.selectedMrgSlots?.includes(slot);
        } else {
            return selectedTerfDetails?.selectedEvgSlots?.includes(slot);
        }
    };

    return (
        <div className='App'>
            <h1>Available Terfs</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {load && <Loader />}
                {!load && terfDetails.map((terf_details, i) => (
                    <Card key={terf_details.terfId} style={{ width: '18rem', margin: '10px' }} onClick={() => handleShow(terf_details)}>
                        <Card.Img variant="top" src={terf_details.image} alt="Turf Image"/>
                        <Card.Body style={{ textAlign: 'left' }}>
                            <Card.Title>{terf_details?.turfName}</Card.Title>
                            <Card.Text>Rate /hour: {terf_details?.rate}</Card.Text>
                            <Card.Text>Available Sports: {terf_details?.availableSports}</Card.Text>
                            <Card.Text>
                                Location:<br /> 
                                {terf_details?.address1}, {terf_details?.address2}, {terf_details?.city}, {terf_details?.state}, {terf_details?.pincode}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Modal
                size='lg'
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Turf Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col lg={6} sm={8}>
                            <img src={selectedTerfDetails?.item?.image} width="100%" alt="Turf" />
                        </Col>
                        <Col lg={6} sm={4}>
                            <h1>{selectedTerfDetails?.item?.turfName}</h1>
                            <h5>Available Sports: {selectedTerfDetails?.item?.availableSports}</h5>
                            <h5> Rate: {selectedTerfDetails?.item?.rate} /hrs</h5>
                            <h5>Location:<br />{selectedTerfDetails?.item?.address1},{selectedTerfDetails?.item?.address2},
                                {selectedTerfDetails?.item?.city},{selectedTerfDetails?.item?.state},{selectedTerfDetails?.item?.pincode}</h5>
                            <div className='pt-3'>
                                <label htmlFor="">Choose Date:</label>&nbsp;&nbsp;
                                <input className='' type='date' value={SelectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)} />
                            </div>
                        </Col>
                    </Row>

                    <h5>Select Slot</h5>
                    <h6>Morning Slots</h6>
                    <div className="d-flex flex-wrap">
                        {selectedTerfDetails?.item?.mrngSlots?.map((item, index) => (
                            <button
                                key={index}
                                className="btn btn-outline-primary m-1"
                                style={{
                                    backgroundColor: isSlotSelected(item, 'morning') ? 'green' : 'white',
                                    color: isSlotSelected(item, 'morning') ? 'white' : 'black'
                                }}
                                onClick={() => handleMrgSlotClick(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <h6 className='pt-2'>Evening Slots</h6>
                    <div className="d-flex flex-wrap">
                        {selectedTerfDetails?.item?.evngSlots?.map((item, index) => (
                            <button
                                key={index}
                                className="btn btn-outline-primary m-1"
                                style={{
                                    backgroundColor: isSlotSelected(item, 'evening') ? 'green' : 'white',
                                    color: isSlotSelected(item, 'evening') ? 'white' : 'black'
                                }}
                                onClick={() => handleEvgSlotClick(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleShow2}>Continue</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={show2}
                onHide={handleClose2}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Booking Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedTerfDetails?.item?.image} className='pb-3' alt="Turf" />
                    <p><strong>Turf Name:</strong> {selectedTerfDetails?.item?.turfName}</p>
                    <p><strong>Location:</strong> {selectedTerfDetails?.item?.address1},{selectedTerfDetails?.item?.address2},
                        {selectedTerfDetails?.item?.city},{selectedTerfDetails?.item?.state},{selectedTerfDetails?.item?.pincode}</p>
                    <p><strong>Selected Slots:</strong> <br /> <strong>Morning:</strong> {selectedTerfDetails?.selectedMrgSlots.join(', ')} <br /> <strong>Evening:</strong> {selectedTerfDetails?.selectedEvgSlots.join(', ')}</p>
                    <p><strong>Rate:</strong> {selectedTerfDetails?.item?.rate} /hour</p>
                    <p><strong>Total Hours:</strong> {selectedTerfDetails?.length} hrs</p>
                    <p><strong>Date:</strong> {SelectedDate}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='btn btn-success mx-auto' disabled>
                        Total Amount: {selectedTerfDetails?.item?.rate * selectedTerfDetails?.length} /-
                    </Button>
                    <Button variant="secondary" onClick={() => { setShow2(false); handleShow(selectedTerfDetails?.item) }}>
                        Back
                    </Button>
                    <Button variant="primary">Book Now</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
