import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './components/Home';
import { AuthProvider } from './utilities/auth';

const App = () => {
    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
            </Routes>
        </AuthProvider>
    );
};

export default App;
