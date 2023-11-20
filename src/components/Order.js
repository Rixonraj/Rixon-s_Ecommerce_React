import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const userId = sessionStorage.getItem("userid")
  const token = sessionStorage.getItem("session")
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/myOrders/${userId}`, {
        headers: {
          'Authorization': token,
          'User-Id': userId,

        }
      });
      setOrders(response.data);
      console.log("response.data", response.data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };
  useEffect(() => {
    // Fetch all orders when the component mounts
    // setLoading(true);
    console.log("userId", userId)
    fetchOrders();
  }, []);



  return (
    <div className="container mt-4">
      <h2 className="mb-4">Orders List</h2>

      {userId ? (!loading ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Details</th>
              <th>Total</th>
              <th>Shipping Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.individualSubtotals.map((item) => (
                    <>
                      <p> {item.name} </p>
                      <p>( ₹{item.price} * {item.quantity} = ₹{item.subtotal} )</p>
                    </>
                  ))}
                </td>
                <td>₹{order.overallSubtotal}</td>
                <td>
                  {order.checkoutDetails.map((item) => (
                    <>
                      <p>Address: {item.address}</p>
                      <p>City: {item.city}</p>
                      <p>Full Name: {item.fullName}</p>
                      <p>Zip Code: {item.zipCode}</p>
                    </>
                  ))}
                </td>
                <td>{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (<h6> Loading ...</h6>)) : (
        <h6> Please Login</h6>
      )}
    </div>
  );
};

export default Orders;