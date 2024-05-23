import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../components/style.css"
import axios from 'axios';
import { getTokenDetail } from './helper';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [Data, setData] = useState();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/loginuser', formData)
            .then(response => {
                console.log("22", response);
                // if(response.data.user.userType === 'ADMIN'){
                //     navigate('/terfDetails')
                // }
                // Handle successful response
                localStorage.setItem('token', response.data);
                setData(response.data);
                getTokenDetail()
                const userType = localStorage.getItem('userType');
                if(userType && userType === "ADMIN"){
                    navigate('/adminDashboard');
                }else{
                    navigate('/terfDetails');
                }

                // if (userId == 1) {
                //     navigate('/adminDashboard');
                // } else {
                //     navigate('/terfDetails');
                // }
            })
            .catch(error => {
                // Handle error
                console.error('Error making POST request:', error);
            });
    }
    const navigate = useNavigate();
    return (
        <div className='container align-card p-5'>
            <div class="card p-4">
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter Email" name='email' value={formData.email} onChange={handleChange} />
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleFormControlInput1" placeholder="Enter Password" name='password' value={formData.password} onChange={handleChange} />
                    </div>
                    <button type="submit" className='btn btn-primary mb-3' >Login</button>
                    <Link to="/register" className='btn btn-default'>Create New</Link>
                </form>
            </div>
        </div>
    )
}
export default Login;
