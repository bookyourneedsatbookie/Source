import React from 'react'
import { Modal, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Loader(isOpen) {
    return (
        <>
            <div isOpen={isOpen} centered className='container d-flex justify-content-center align-self-end p-5 mt-5'>
                <div className='loader-model d-flex justify-content-center align-middle bg-transparent p-5 m-5'>
                    <div className='loader'></div>
                </div>
            </div>
        </>


        // <div className='loader'></div>
    )
}

