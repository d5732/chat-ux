import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Auth from './components/Auth';
import App from './App';
import ProtectedRoute from './util/ProtectedRoute';
import DoctorLookup from './components/DoctorLookup';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter basename={'/'}>
			<Routes>
				<Route path='/auth' element={<Auth />}>
					<Route path='signin' element={<Signin />} />
				</Route>
				<Route path="/" element={<App />}>
					<Route path='doctor-lookup' element={
						<ProtectedRoute>
							<DoctorLookup />
						</ProtectedRoute>
					} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
