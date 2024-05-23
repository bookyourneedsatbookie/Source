import React, { useState, useEffect } from 'react';
import axios from 'axios';
import base64 from 'base-64';
import { Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Loader from './Loader';

const AdminDashboard = () => {
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const handleClose2 = () => setShow2(!show2);
    const handleClose3 = () => setShow3(!show3);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [terfDetails, setterfDetails] = useState([]);
    const [terfid, setTerfid] = useState(null);
    const [load, setLoad] = useState(true);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const [formData, setFormData] = useState({
        turfName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        mrngSlots: '',
        evngSlots: '',
        image: '',
        userId: userId,
        rate: '',
        availableSports: ''
    });

    const getDashboard = (userId) => {
        setLoad(true)
        axios.get(`http://localhost:3000/getAllTerfs/${userId}`, config)
            .then(res => {
                if (res.status === 200) {
                    setterfDetails(res.data.terf_details);
                    setLoad(false)
                }
            })
            .catch(e => console.log(e));
    }

    const handleDelete = (terfId) => {
        setLoad(true)
        axios.delete(`http://localhost:3000/deleteterf/${terfId}`, config)
            .then(res => {
                if (res.status === 200) {
                    setLoad(false)
                    alert("Turf deleted successfully");
                    getDashboard(userId); // Refresh the list
                }
            })
            .catch(e => console.log(e));
    }

    const handleStateChange = (terfId) => {
        setLoad(true)
        axios.get(`http://localhost:3000/terf/${terfId}`, config)
            .then(res => {
                if (res.status === 200) {
                    setFormData({
                        turfName: res.data.turfName,
                        address1: res.data.address1,
                        address2: res.data.address2,
                        city: res.data.city,
                        state: res.data.state,
                        pincode: res.data.pincode,
                        mrngSlots: res.data.mrngSlots,
                        evngSlots: res.data.evngSlots,
                        image: res.data.image,
                        userId: userId,
                        rate: res.data.rate,
                        availableSports: res.data.available_sports
                    });
                    setLoad(false)

                }
            })
            .catch(e => console.log(e));
    }

    useEffect(() => {
        getDashboard(userId);
    }, [userId]);

    useEffect(() => {
        if (terfid) {
            handleStateChange(terfid);
        }
    }, [terfid]);

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoad(true)
        axios.post('http://localhost:3000/registerterf', formData, config)
            .then(response => {
                alert("Turf added");
                setLoad(false)
                handleClose2();
                getDashboard(userId); // Refresh the list
            })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
    }

    const handleUpdate = () => {
        setLoad(true)
        axios.post(`http://localhost:3000/updateterf/${terfid}`, formData, config)
            .then(response => {
                alert("Turf updated");
                setLoad(false)
                handleClose3();
                getDashboard(userId); // Refresh the list
            })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
    }

    const handleShow2 = () => {
        setFormData({
            turfName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            pincode: '',
            mrngSlots: '',
            evngSlots: '',
            image: '',
            userId: userId,
            rate: '',
            availableSports: ''
        });
        setShow2(!show2);
    }

    const handleShow3 = (terfId) => {
        setTerfid(terfId);
        setShow3(!show3);
    }

    return (
        <>
            <div>
                <div className='text-end my-2 mx-2'>
                    <Button color="success" onClick={handleShow2}>
                        Add New
                    </Button>
                </div>
                {load && <Loader/>}
                {!load && terfDetails.map((terf_details, i) => (
                    <div className="card" key={i}>
                        <div className="card-body">
                            <div className="container text-center">
                                <div className="row">
                                    <div className="col-4">
                                        <img className='terf-poster' width="80%" src={terf_details.image} alt={terf_details.name} />
                                    </div>
                                    <div className="col-8">
                                        <p className='fw-bold text-start lh-sm'>{terf_details.turfName}</p>
                                        <p className='text-start lh-sm'>Price: {terf_details.rate}/hour</p>
                                        <p className='text-start lh-sm'>Available Sports: {terf_details.available_sports}</p>
                                        <p className='text-start lh-sm'>Location: {terf_details.address1}, {terf_details.address2}, {terf_details.city}, {terf_details.state}, {terf_details.pincode}</p>
                                        <div className='row'>
                                            <div className="col ml-5">
                                                <Button color="primary" onClick={() => { handleShow3(terf_details.terfId) }}>
                                                    Edit
                                                </Button>
                                            </div>
                                            <div className="col">
                                                <button className='btn btn-danger' onClick={() => handleDelete(terf_details.terfId)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                show={show2}
                onHide={handleClose2}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Turf</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Turf Name</label>
                        <input type="text" className="form-control" placeholder="Enter turf name" name='turfName' value={formData.turfName} onChange={handleChange} ></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Turf Address1</label>
                        <input type="text" className="form-control" placeholder="Address line 1" name='address1' value={formData.address1} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Turf Address2</label>
                        <input type="text" className="form-control" placeholder="Address line 2" name='address2' value={formData.address2} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" placeholder="Enter City" name='city' value={formData.city} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">State</label>
                        <input type="text" className="form-control" placeholder="Enter State" name='state' value={formData.state} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Pincode</label>
                        <input type="text" className="form-control" placeholder="Enter Pincode" name='pincode' value={formData.pincode} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Rate /hour</label>
                        <input type="text" className="form-control" placeholder="Enter turf rate" name='rate' value={formData.rate} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Available Sports</label>
                        <input type="text" className="form-control" placeholder="Select Available Sports" name='availableSports' value={formData.availableSports} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Morning Slots</label>
                        <input type="text" className="form-control" placeholder="Select Morning Slots" name='mrngSlots' value={formData.mrngSlots} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Evening Slots</label>
                        <input type="text" className="form-control" placeholder="Select Evening Slots" name='evngSlots' value={formData.evngSlots} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload Image</label>
                        <input type="file" className="form-control" name='image' onChange={handleChange}></input>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                        Close
                    </Button>
                    <Button className='btn btn-success' onClick={handleSubmit}>
                        Register
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={show3}
                onHide={handleClose3}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Turf</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Turf Name</label>
                        <input type="text" className="form-control" placeholder="Enter turf name" name='turfName' value={formData.turfName} onChange={handleChange} ></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Turf Address1</label>
                        <input type="text" className="form-control" placeholder="Address line 1" name='address1' value={formData.address1} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Turf Address2</label>
                        <input type="text" className="form-control" placeholder="Address line 2" name='address2' value={formData.address2} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" placeholder="Enter City" name='city' value={formData.city} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">State</label>
                        <input type="text" className="form-control" placeholder="Enter State" name='state' value={formData.state} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Pincode</label>
                        <input type="text" className="form-control" placeholder="Enter Pincode" name='pincode' value={formData.pincode} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Rate /hour</label>
                        <input type="text" className="form-control" placeholder="Enter turf rate" name='rate' value={formData.rate} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Available Sports</label>
                        <input type="text" className="form-control" placeholder="Select Available Sports" name='availableSports' value={formData.availableSports} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Morning Slots</label>
                        <input type="text" className="form-control" placeholder="Select Morning Slots" name='mrngSlots' value={formData.mrngSlots} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Evening Slots</label>
                        <input type="text" className="form-control" placeholder="Select Evening Slots" name='evngSlots' value={formData.evngSlots} onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload Image</label>
                        <input type="file" className="form-control" name='image' onChange={handleChange}></input>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose3}>
                        Close
                    </Button>
                    <Button className='btn btn-success' onClick={handleUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminDashboard;