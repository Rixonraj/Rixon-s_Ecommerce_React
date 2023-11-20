// CartIcon.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const CartIcon = ({ cartItemCount }) => {
  return (
    <Nav.Link as={Link} to="/cart">
      <i className="fas fa-shopping-cart"></i>
      Cart
      {cartItemCount > 0 && (
        <span className="ml-1"> ( {cartItemCount} )</span>
      )}
    </Nav.Link>
  );
};

export default CartIcon;
