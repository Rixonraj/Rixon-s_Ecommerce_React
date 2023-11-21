import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Summary = ({ cartItems, setCartItems, checkoutDetails }) => {
  const navigate = useNavigate();
  const [isPlacingOrder, setPlacingOrder] = useState(false);
  console.log("cartItems", cartItems)
  console.log("cartItems", checkoutDetails)
  const userId = sessionStorage.getItem("userid")
  const token = sessionStorage.getItem("session")

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    const individualSubtotals = cartItems.map((item) => ({
      id: item._id,
      name: item.name,
      fileName: item.fileName,
      price: item.price,
      quantity: item.quantity,
      subtotal: (item.price * item.quantity).toFixed(2),
    }));

    const overallSubtotal = individualSubtotals.reduce(
      (total, item) => total + parseFloat(item.subtotal),
      0
    ).toFixed(2);

    const requestBody = {
      individualSubtotals,
      overallSubtotal,
      orderStatus: "placed",
      checkoutDetails: checkoutDetails,
      userId: sessionStorage.getItem("userid")
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKENDURL}/placeOrder`, requestBody, {
        headers: {
          'Authorization': token,
          'User-Id': userId,
        }
      });
      setCartItems([])
      alert("Order placed successfully")
      navigate('/orders')
      console.log('Order placed successfully:', response.data);
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
    setTimeout(() => {
      setPlacingOrder(false);
    }, 2000);


  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Order Summary</h2>
      {checkoutDetails ? <> <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Shipping Details:</h4>
          <p className="card-text"><strong>Full Name:</strong> {checkoutDetails.fullName}</p>
          <p className="card-text"><strong>Address:</strong> {checkoutDetails.address}</p>
          <p className="card-text"><strong>City:</strong> {checkoutDetails.city}</p>
          <p className="card-text"><strong>Zip Code:</strong> {checkoutDetails.zipCode}</p>
          <Link to="/checkout" className="btn btn-primary float-right">
            Change Details
          </Link>
        </div>
      </div>

        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Cart Items:</h4>
            <ul className="list-group">
              {cartItems.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <img src={item.fileName} alt={item.name} className="mr-3" style={{ maxWidth: '50px' }} />
                    <div>
                      {item.name} -  ₹{item.price} each
                    </div>
                  </div>
                  <div>
                    Quantity: {item.quantity}
                  </div>
                  <div>
                    Total:  ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-footer">
            <Link to="/cart" className="btn btn-secondary float-right">
              Edit Cart
            </Link>
          </div>
        </div>


        <div className="mt-4 text-center">
          <button
            className="btn btn-success btn-lg"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Place Order'
            )}
          </button>
        </div> </> : <>
        <p> Cart is Empty</p>
      </>}
    </div>
  );
};

export default Summary;
