import React from 'react'
import Card from 'react-bootstrap/Card';
export default function BottomNavbar() {
    return (
        <div style={{position:"absolute",bottom:"0",width:"100%",borderRight:"2px",boxShadow:"0px 1px 1px 1px",height:"40px"}}>
                <div className='row'>
                    <div className='col-3 text-center align-center'>
                        <i className="bi bi-house-fill"></i>
                    </div>
                    <div className='col-3 text-center'>
                        <i className="bi bi-bell-fill"></i>
                    </div>
                    <div className='col-3 text-center'>
                        <i className="bi bi-clock-fill"></i>
                    </div>
                    <div className='col-3 text-center'>
                        <i className="bi bi-house-fill"></i>
                    </div>
                </div>
        </div>
    )
}
