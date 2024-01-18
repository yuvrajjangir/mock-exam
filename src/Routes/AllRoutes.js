import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
// import { DashBoard } from '../Components/DashBoard'
import Dashboard from '../Components/DashBoard'
import Login from '../Components/Login';
export const AllRoutes = () => {
    const [authStatus, setAuthStatus] = useState(false);
    
  return (
   <Routes>
    <Route path='/' element={<Dashboard authStatus={authStatus} setAuthStatus={setAuthStatus}/>}/>
    <Route path='/login' element={<Login setAuthStatus={setAuthStatus}/>}/>
   </Routes>
  )
}

