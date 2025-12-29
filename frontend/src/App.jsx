import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';


import { DoctorProvider, DoctorContext } from "./context/DoctorContext";
import { PatientContextProvider, PatientContext } from "./context/PatientContext";
import DoctorDashboard from './pages/DoctorDashboard';
import DocNav from './components/DocNav';
import Sidebar from './components/Sidebar';
import DocAppointment from './pages/DocAppointment';
import DoctorProfile from './pages/DoctorProfile';
import Prescriptions from './pages/Prescriptions';
const PrivateDoctorRoute = ({ children }) => {
    // Correctly checking for 'doctorToken'
    const storedToken = localStorage.getItem('doctorToken');
    if (!storedToken) { // simplified check
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PrivatePatientRoute = ({ children }) => {
    // Correctly checking for 'patientToken'
    const storedToken = localStorage.getItem('patientToken');
    if (!storedToken) { // simplified check
        return <Navigate to="/login" replace />;
    }
    return children;
};

const isDoctor = localStorage.getItem('doctorToken');
const App = () => {
  return (
    <DoctorProvider>
    <PatientContextProvider>
      <div>
    {isDoctor ? <DocNav /> : <Navbar />}
                
                {/* 2. MAIN LAYOUT CONTAINER: This container enables side-by-side layout */}
                <div className="flex mx-4 sm:mx-[10%]"> 
                    {/* 3. SIDEBAR: Renders first on the left */}
                    {isDoctor ? <Sidebar /> : null}
                    {/* 4. MAIN CONTENT AREA: Renders next to the sidebar */}
                    <main className={isDoctor ? "flex-grow ml-4" : "w-full"}> 
          
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateDoctorRoute>
              <DoctorDashboard />
            </PrivateDoctorRoute>
          }
        />
         <Route
          path="/appointments"
          element={
            <PrivateDoctorRoute>
              <DocAppointment />
            </PrivateDoctorRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route 
              path="/my-profile" 
              element={
                <PrivatePatientRoute>
                  <MyProfile />
                </PrivatePatientRoute>
              } 
            />
            <Route 
              path="/my-appointments" 
              element={
                <PrivatePatientRoute>
                  <MyAppointments />
                </PrivatePatientRoute>
              } 
            />

            {/* You would use PrivateDoctorRoute for doctor-specific pages */}
            <Route 
              path="/appointment/:docId" 
              element={
                <PrivatePatientRoute>
                  <Appointment />
                </PrivatePatientRoute>
              } 
            />
            <Route 
            path="/docProfile" 
            element={
              <PrivateDoctorRoute>
                <DoctorProfile />
              </PrivateDoctorRoute>
            } 
          />
          <Route 
            path="/prescriptions" 
            element={
              <PrivateDoctorRoute>
                <Prescriptions />
              </PrivateDoctorRoute>
            } 
          />
      </Routes>
      </main>
      </div>
      <Footer/>
    </div>
    </PatientContextProvider>
    </DoctorProvider>
  );
};

export default App;
