import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersList = () => {
  const userId = sessionStorage.getItem("userid")
  const token = sessionStorage.getItem("session")
  const loggedinAdmin = sessionStorage.getItem("loggedinAdmin")
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/orders`, {
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
    if (loggedinAdmin !== null) {
      fetchOrders()
    }
  }, []);

  const handleAction = async (orderId, actionType) => {
    // setLoading(true);
    const orderUpdateBody = { orderStatus: actionType };

    try {
      // Make a PUT request to the API endpoint with the updated data
      const response = await axios.put(`${process.env.REACT_APP_BACKENDURL}/updateOrders/${orderId}`, orderUpdateBody, {
        headers: {
          'Authorization': token,
          'User-Id': userId,
        }
      });
      fetchOrders()
      // Handle the response (you can customize this based on your needs)
      console.log('Order updated successfully:', response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle errors (you can customize this based on your needs)
      console.error('Error updating order:', error.message);
    }

  }

  return (

    <div className="container mt-4">
      <h2 className="mb-4">Orders List</h2>
      {loggedinAdmin ? (!loading ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item Details</th>
              <th>Total</th>
              <th>Customer Details</th>
              <th>Status</th>
              <th>Actions</th>
              {/* Add more table headers based on your order schema */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.individualSubtotals.map((item) => (
                    <span key={item._id}>
                      <p> {item.name} </p>
                      <p>( ₹{item.price} * {item.quantity} = ₹{item.subtotal} )</p>
                    </span>
                  ))}
                </td>
                <td>₹{order.overallSubtotal}</td>
                <td>
                  {order.checkoutDetails.map((item) => (
                    <span key={item._id}>
                      <p>Address: {item.address}</p>
                      <p>City: {item.city}</p>
                      <p>Full Name: {item.fullName}</p>
                      <p>Zip Code: {item.zipCode}</p>
                    </span>
                  ))}
                </td>
                <td>{order.orderStatus}</td>
                <td>
                  <button type="button" className='btn btn-success' onClick={() => { handleAction(order._id, "shipped") }} > Mark as Shipped </button>
                  <br />
                  <button type="button" className='btn btn-danger mt-3' onClick={() => { handleAction(order._id, "cancelled") }}> Cancel </button>
                </td>

                {/* Add more table cells based on your order schema */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (<h6> Loading ...</h6>)) : (
        <h6> Please Login as Admin</h6>
      )}



    </div>
  );
};

export default OrdersList;