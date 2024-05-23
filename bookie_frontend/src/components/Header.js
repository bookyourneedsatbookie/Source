import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Loader from './Loader';


export default function Header() {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [ProfileData, setProfileData] = useState({});
    const userRole = localStorage.getItem('userType');
    const [load, setLoad] = useState(false);
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };
    const [formData, setFormData] = useState({
        bankName : '',
        accNumber : '',
        accHolderName : '',
        ifscCode : '',
        accType : '',
        userId: userId,
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleUpdate = () => { // Removed terfId as a parameter
        setLoad(true);
        axios.post(`http://localhost:3000/registerBank/${userId}`, formData) // Use terfid from state
            .then(response => {
                console.log("Response  ", response);
                alert("Bank Details Updated");
                handleClose2(); // Close the modal after update
                setLoad(false);
            })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
    };
    const handleShow = (userId) => {
        setLoad(true)
        axios.get(`http://localhost:3000/getUser/${(userId)}`, config).then(res => {
            if (res.status === 200) {
                setShow(true);
                console.log("get USER ", res.data)
                setProfileData(res.data)
                setLoad(false)
            }
        }).catch(error => {
            console.error('Error making POST request:', error);
        });
        console.log("demo", ProfileData)
    }
    const handleShow1 = () => {
        setShow(false);
        setShow1(true);
    }
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const handleShow2 = () => {
        handleClose2(true)
        setShow2(true);
    };
    console.log("234", ProfileData)
    console.log("userid chck ", userId)
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <a className="navbar-brand" href="#">BOOKIE</a>
                    {/* <i className="bi bi-bell-fill"></i> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" onClick={() => { handleShow(userId) }}>Profile</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">My Bookings</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Contest</a>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <>
                {load && <Loader></Loader>}
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            !load &&
                            <><h3>Basic Details</h3><p><strong>User ID :</strong> &nbsp;{ProfileData?.user_details?.userId}</p><p><strong>First Name :</strong>&nbsp;{ProfileData?.user_details?.firstName} </p><p><strong>Last Name :</strong>&nbsp; {ProfileData?.user_details?.lastName}</p><p><strong>Email :</strong>&nbsp; {ProfileData?.user_details?.email}</p><p><strong>Mobile :</strong>&nbsp; {ProfileData?.user_details?.mobile}</p><p><strong>Date of Birth :</strong>&nbsp; {ProfileData?.user_details?.dob}</p><p><strong>Gender :</strong>&nbsp; {ProfileData?.user_details?.gender}</p><p><strong>Address :</strong>&nbsp; {ProfileData?.user_details?.address1},{ProfileData?.user_details?.address2},{ProfileData?.user_details?.city},{ProfileData?.user_details?.state},{ProfileData?.user_details?.pincode}</p>
                                {userRole === 'ADMIN' &&
                                    <React.Fragment>
                                        <h3>Bank Details</h3>
                                        {ProfileData?.bank_details == null || ProfileData?.bank_details == {} ?
                                            <Button variant="secondary" onClick={handleShow2}>Add bank details</Button> :
                                            <div>
                                                <p><strong>Bank Name :</strong>&nbsp; {ProfileData?.bank_details?.bankName}</p>
                                                <p><strong>Account Number :</strong>&nbsp; {ProfileData?.bank_details?.accNumber}</p>
                                                <p><strong>Account holder Name :</strong>&nbsp; {ProfileData?.bank_details?.accHolder}</p>
                                                <p><strong>IFSC code :</strong>&nbsp; {ProfileData?.bank_details?.ifscCode}</p>
                                                <p><strong>Account Type :</strong>&nbsp; {ProfileData?.bank_details?.accType}</p>
                                            </div>
                                        }
                                    </React.Fragment>}
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Back
                        </Button>
                        <Button variant="primary" onClick={handleShow1}>Edit Profile</Button>
                    </Modal.Footer>
                </Modal>


                <Modal
                    show={show1}
                    onHide={handleClose1}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <img src={selectedTerfDetails.image} className='pb-3' alt="" /> */}
                        <h5>User ID : ADM01</h5>
                        <h5>First Name : Kumaresh</h5>
                        <h5>Last Name : A</h5>
                        <h5>Email : kumaresh@test.com</h5>
                        <h5>Mobile : 6381110664</h5>
                        <h5>Date of Birth : 04/03/2000</h5>
                        <h5>Gender : Male</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setShow1(false); handleShow() }}>
                            Back
                        </Button>
                        <Button variant="primary">Update</Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={show2}
                    onHide={handleClose2}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>ADD BANK</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-2'>
                            <label htmlFor="gender">Bank Name</label>
                            <select className='form-control' name='bankName' value={formData.option} onChange={handleChange}
                            >
                                <option value="select">Select</option>
                                <option value="select">HDFC Bank</option>
                                <option value="select">ICICI Bank</option>
                                <option value="male">Indian Bank</option>
                                <option value="male">Indian Overseas Bank</option>
                                <option value="male">Karur Vysya Bank</option>
                                <option value="female">State Bank of India</option>

                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Account Number</label>
                            <input type="number" className="form-control" placeholder="Enter Account Number" name='accNumber' value={formData.accNumber} onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Account Holder Name</label>
                            <input type="text" className="form-control" placeholder="Enter Account Holder Name" name='accHolderName' value={formData.accHolderName} onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">IFSC Code</label>
                            <input type="text" className="form-control" placeholder="Enter IFSC code" name='ifscCode' value={formData.ifscCode} onChange={handleChange}></input>
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="gender">Account Type</label>
                            <select className='form-control' name='accType' value={formData.option} onChange={handleChange}
                            >
                                <option value="select">Select</option>
                                <option value="male">Savings</option>
                                <option value="female">Current</option>

                            </select>
                        </div>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose2}>
                            Close
                        </Button>
                        <Button className='btn btn-success' onClick={handleUpdate}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

        </div>
    );
}
