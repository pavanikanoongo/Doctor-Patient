import React from 'react'
import { useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {

    const {doctorToken}=useContext(DoctorContext)
  return (
    <div className='min-h-screen bg-white border-r'>
       <ul className='text-[#515151] mt-5'>
        <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor pointer${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
        </NavLink >
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor pointer${isActive?'bg-[#F2F3FF] border-r-4 border-primary':""}`}  to={'/appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
        </NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor pointer${isActive?'bg-[#F2F3FF] border-r-4 border-primary':""}`} to={'/docProfile'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Profile</p>
        </NavLink>
        <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor pointer${isActive?'bg-[#F2F3FF] border-r-4 border-primary':""}`} to={'/prescriptions'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Prescriptions</p>
        </NavLink>
       </ul>
    </div>
  )
}

export default Sidebar
