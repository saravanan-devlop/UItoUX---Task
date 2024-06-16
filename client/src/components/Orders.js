import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Orders = () => {
    const { userId } = useParams();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/orders/${userId}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    }, [userId]);

    return (
        <div>
            <h1>Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        Order ID: {order.id}, Total: ${order.total}, Status: {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Orders;
