import Login from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "bootstrap-icons/font/bootstrap-icons.css";
import TerfGround from './components/TerfGround';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import BottomNavbar from './components/BottomNavbar';
export default function App() {

  return (
    <><Header /><BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/terfDetails' element={<TerfGround />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
        <Route path='/bottombar' element={<BottomNavbar />} />
      </Routes>
    </BrowserRouter></>
  )
}
