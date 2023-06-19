// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
// import './App.css'
// import Signup from "./components/Signup";
// import Signin from "./components/Signin";
// import DoctorLookup from "./components/DoctorLookup";

// function App() {
  
//   return (
//     <div className="wrapper">
//       <Router>
//         <Routes>
//           <Route path="/" element={<Navigate to="/doctor-lookup" replace />} />
//           <Route path="/signup" element={<Signup /> }/>
//           <Route path="/login" element={<Signin /> }/>
//           <Route path="/doctor-lookup" element={<DoctorLookup /> }/>
//           <Route path='*' element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </div>
//   )
// }

// export default App

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import './App.css'
import PortalNavbar from "./components/PortalNavbar";
import { Container } from "react-bootstrap";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkUserToken = () => {
      const userToken = localStorage.getItem('user-token');
      if (!userToken || userToken === 'undefined') {
          setIsLoggedIn(false);
      }
      setIsLoggedIn(true);
  }

  useEffect(() => {
      checkUserToken();
  }, [isLoggedIn]);
  return (
		<Container className="h-full w-full">
			{isLoggedIn && <PortalNavbar />}
			<Outlet />
		</Container>
	);
}

export default App
