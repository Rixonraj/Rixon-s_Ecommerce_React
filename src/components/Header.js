// Header.js
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import CartIcon from './CartIcon';
import { useLocation } from 'react-router-dom';

const Header = ({ cartItems, user, isLoggedin, setisLoggedin }) => {
  const navigate = useNavigate()
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation().pathname;
  const userId = sessionStorage.getItem("userid")
  const [isAdminpage, setisAdminpage] = useState(((location.split("/")[1] === 'admindashboard' || location.split("/")[1] === 'adminlogin' || location.split("/")[1] === 'adminsignup' || location.split("/")[1] === 'adminforgot-password') ? true : false));
  // sticky nav
  const [stickyClass, setStickyClass] = useState("");

  function stickNavbar() {
    let windowHeight = window.scrollY;
    setStickyClass("active")
  }
  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);
  })
  useEffect(() => {
    // Update cart item count whenever cartItems changes
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalItems);
  }, [cartItems]);

  const handleAdminClick = () => {
    setisAdminpage(true);

  };
  const handleUserClick = () => {
    setisAdminpage(false);

  };
  const handleLogout = () => {
    sessionStorage.removeItem('session')
    sessionStorage.removeItem('userid')
    sessionStorage.removeItem('loggedinAdmin')

    setisLoggedin(false)
  }
  const handleLogin = () => {
    handleLogout()
    navigate('/login')
  }
  const handleAdminLogin = () => {
    handleLogout()
    navigate('/adminlogin')
  }
  return (
    <Navbar bg="light" expand="lg" className={`navBarZ ${stickyClass}`}>

      <Navbar.Brand as={Link} to="/admindashboard" onClick={handleAdminClick} >
        <span className={`${isAdminpage ? "selectedProfile ms-3" : "ms-3"}`}>  Admin  </span>
      </Navbar.Brand>
      |
      <Navbar.Brand as={Link} to="/" onClick={handleUserClick}>
        <span className={`${isAdminpage ? "ms-3" : "ms-3 selectedProfile"}`}>  User  </span>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        {isAdminpage ? <Nav className="ms-auto">
          <Nav.Link as={Link} to="/admindashboard/orders">
            Received Orders
          </Nav.Link>
          <Nav.Link as={Link} to="/admindashboard/products">
            Products
          </Nav.Link>
          <Nav.Link as={Link} to="/admindashboard/createproduct">
            Create Product
          </Nav.Link>
          {isLoggedin ? <Nav.Link as={Link} to="/admindashboard">
            <button className="btn btn-danger" onClick={() => { handleLogout() }}> Logout </button>
          </Nav.Link> :
            <button className="btn btn-info" onClick={() => { handleAdminLogin() }}> Admin Login </button>
          }
        </Nav> : <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/products">
            Products
          </Nav.Link>
          <Nav.Link as={Link} to="/orders">
            Orders
          </Nav.Link>
          <Nav.Link as={Link} to="/favorites">
            Favorites
          </Nav.Link>
          <CartIcon cartItemCount={cartItemCount} />
          {isLoggedin ? <Nav.Link as={Link} to="/">
            <button className="btn btn-danger" onClick={() => { handleLogout() }}> Logout </button>
          </Nav.Link> :
            <button className="btn btn-info" onClick={() => { handleLogin() }}> User Login </button>
          }
        </Nav>}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
