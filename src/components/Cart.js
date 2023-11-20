import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const user =  sessionStorage.getItem("session") ? true: false 

  const itemsWithTotal = cartItems.map((item) => ({
    ...item,
    total: item.price * item.quantity,
  }));

  const overallTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const resetQuantityAndRemove = (productId) => {
    // Set quantity to 0 when removing an item
    updateQuantity(productId, 0);
    removeFromCart(productId);
  };

  // State to manage the display of the checkout component
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const handleProceedToCheckout = () => {
    // Open the checkout component
    setCheckoutOpen(true);
  };

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="list-group">
            {itemsWithTotal.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {item.name} - ${item.price} each
                </div>
                <div className="d-flex align-items-center">
                  <label className="mr-2">Quantity:</label>
                  <input
                    key={`quantity-${item.id}`}
                    id={`quantity-${item.id}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value, 10))}
                    min="1"
                  />
                  <button className="btn btn-danger ml-2" onClick={() => resetQuantityAndRemove(item.id)}>
                    Remove
                  </button>
                </div>
                <div>
                  Total: ${item.total.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <strong>Overall Total:</strong> ${overallTotal.toFixed(2)}
          </div>
          <Link to={user ? '/checkout' : '/login'} className="btn btn-primary mt-3">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
