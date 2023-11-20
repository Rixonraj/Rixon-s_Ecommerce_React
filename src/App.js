import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from './components/Header';
import Home from './components/Home';
import ProductList from './components/ProductList';
import NotFound from './components/NotFound';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Summary from './components/Summary';

// ... (other imports and code)

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ProductDetails from './components/ProductDetails';
import Orders from './components/Order';
import Favorites from './components/Favorites';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminSignUp from './components/AdminSignUp';
import AdminForgotPassword from './components/AdminForgotPassword';
import Emailverify from './components/Emailverify';
import Newpassword from './components/Newpassword';
import AdminEmailVerify from './components/AdminEmailVerify';
import AdminNewPassword from './components/AdminNewPassword';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [user, setUser] = useState(null);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [getAllProducts, setgetAllProducts] = useState([[]]);
  const [admin, setAdmin] = useState(true);
  const [isLoggedin, setisLoggedin] = useState((sessionStorage.getItem('session') === null ? false : true ))
  const[productDetails,setproductDetails] = useState([]);
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, { ...product, quantity: productQuantities[product._id] || 1 }]);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    console.log('Updating quantity:', productId, quantity);
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));

    const updatedCartItems = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );

    console.log('Updated Cart Items:', updatedCartItems);

    setCartItems(updatedCartItems);

    // If quantity is set to 0, remove the productId from productQuantities
    if (quantity === 0) {
      setProductQuantities((prevQuantities) => {
        const { [productId]: removedProduct, ...rest } = prevQuantities;
        return rest;
      });
      removeFromCart(productId);
    }
  };
  // Function to handle form details from Checkout.js
  const onCheckout = (formData) => {
    setCheckoutDetails(formData);
  };

  const markFavorite = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  //Login Logout
  const onLogin = (username) => {
    setUser(username);
    setisLoggedin(true)
  };

  const handleLogout = () => {
    setUser(null);
  };

  //Admin Login

  const handleAdminLogin = (username) => {
    setUser(username);
  };

  const handleAdminLogout = () => {
    setUser(null);
  };


  return (
    <Router>
      <div className="App">
        <Header cartItems={cartItems} user={user} admin={admin} isLoggedin={isLoggedin} setisLoggedin={setisLoggedin}/>
        <div style={{ marginTop: '10px' }}>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route path='/emailVerification/:id' element={<Emailverify />}></Route>
            <Route path='/updatePassword/:id' element={<Newpassword  />}></Route>
            <Route path='/adminupdatePassword/:id' element={<AdminNewPassword />}></Route>
            <Route
              path="/login"
              element={<Login onLogin={onLogin} isLoggedin={isLoggedin} />}
            />
            <Route path="/signup" element={<Signup isLoggedin={isLoggedin} />} />
            <Route path="/forgot-password" element={<ForgotPassword isLoggedin={isLoggedin} />} />
            <Route
              path="/products"
              element={<ProductList addToCart={addToCart} updateQuantity={updateQuantity} productQuantities={productQuantities} cartItems={cartItems} markFavorite={markFavorite} favorites={favorites} setgetAllProducts={setgetAllProducts} setproductDetails = {setproductDetails} />}
            />
            <Route
              path="/productDetail"
              element={<ProductDetails addToCart={addToCart} updateQuantity={updateQuantity} productQuantities={productQuantities} cartItems={cartItems} productDetails={productDetails} />}
            />
            <Route
              path="/cart"
              element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} user={user} />}
            />
            <Route
              path="/checkout"
              element={<Checkout onCheckout={onCheckout} user={user} checkoutDetails={checkoutDetails} />}
            />
            <Route
              path="/summary"
              element={<Summary cartItems={cartItems} setCartItems={setCartItems} checkoutDetails={checkoutDetails} />}
            />
            <Route
              path="/orders"
              element={<Orders user={user} />}
            />
            <Route
              path="/favorites"
              element={<Favorites favorites={favorites} getallProducts={getAllProducts} addToCart={addToCart} updateQuantity={updateQuantity} productQuantities={productQuantities} cartItems={cartItems} />}
            />
            <Route
              path="/adminlogin"
              element={<AdminLogin onLogin={onLogin} handleAdminLogin={handleAdminLogin} />}
            />
            <Route path="/adminsignup" element={<AdminSignUp />} />
            <Route path="/adminforgot-password" element={<AdminForgotPassword />} />
            <Route path='/adminemailVerification/:id' element={<AdminEmailVerify />}></Route>

            <Route
              path="/admindashboard"
              element={<AdminDashboard handleAdminLogin={handleAdminLogin} />}
            />
            <Route
              path="/admindashboard/:page"
              element={<AdminDashboard user={user} />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;

