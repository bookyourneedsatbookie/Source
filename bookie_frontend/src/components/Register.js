import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import '../components/style.css'
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        dob: '',
        gender: '',
        userType: 'User',
    });
    const [formData1, setFormData1] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/registeruser', formData)
            .then(response => {
                console.log("Response  ",response)
                // window.location.href = '/';
            })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
    }
    return (
        <div>
            <div className='container align-card p-4 mt-3'>
                <div class="card p-2">
                    <form onSubmit={handleSubmit}>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter First Name" name='firstName' value={formData.firstNamr} onChange={handleChange} />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Last Name" name='lastName' value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Email</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Email" name='email' value={formData.email} onChange={handleChange} />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Mobile</label>
                            <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Enter Mobile" name='mobile' value={formData.mobile} onChange={handleChange} />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="exampleFormControlInput1" placeholder="Enter Password" name='password' value={formData.password} onChange={handleChange} />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">DOB</label>
                            <input type="date" class="form-control" id="exampleFormControlInput1" placeholder="Select DOB" name='dob' value={formData.dob} onChange={handleChange} />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="gender">Gender:</label>
                            <select className='form-control' name='gender' value={formData.option} onChange={handleChange}
                            >
                                <option value="select">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>

                            </select>
                        </div>
                        <button type="submit" className='btn btn-primary mb-3' >Register</button>
                        <Link to="/" className='btn btn-default'>Login</Link>
                    </form>
                </div>  
            </div>
        </div>
    )
}
export default Register;
