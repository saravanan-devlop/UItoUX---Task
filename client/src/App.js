import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Orders from './components/Orders';
import Reviews from './components/Reviews';
import ProductDetails from './components/ProductDetails';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/orders/:userId" element={<Orders />} />
                    <Route path="/reviews/:productId" element={<Reviews />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
