import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
// Components
import ProductForm from './AdminProductForm';
import OrderList from './AdminOrderList';
import ProductList from './AdminProductList';
import AdminLogin from './AdminLogin';
import AdminSignUp from './AdminSignUp';
import AdminForgotPassword from './AdminForgotPassword';
import AdminEditProduct from './AdminEditProduct';

const AdminDashboard = ({ handleAdminLogin }) => {
  const { page } = useParams();
  const location = useLocation().pathname;

  // Access the current pathname
  console.log('Pathname:', location.split("/")[1]);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(page)

  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const editProduct = (productId, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === productId ? updatedProduct : product))
    );
  };

  const removeProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };


  return (
    <div className="admin-dashboard">
      {
        page === "orders" ?
          <div className="admin-section">
            <h3>View Orders</h3>
            <OrderList orders={orders} />
          </div> :
          page === "products" ?
            <div className="admin-section">
              <h3>My Products</h3>
              <ProductList products={products} onEdit={editProduct} onRemove={removeProduct} />
            </div> :
            page === "createproduct" ?
              <div className="admin-section">
                <h3>Create Product</h3>
                <ProductForm onSubmit={addProduct} />
              </div> :
              <div className="">
                <div className="jumbotronStyle" >


                </div>

                <div className='contentjombo'>
                  <h1 className="" >Welcome to Admin Dashboard</h1>
                  <h5 className="" >
                    Create Produts with Photos<br />
                    &<br />
                    Edit them too !!!
                  </h5>
                  <hr className="my-4" />
                  <h4 >
                    View All The Orders <br />
                    &<br /> Update them on the Go !
                    <br />
                    <br />
                    <br />
                  </h4>
                  <h5>
                    Shop with confidence!
                  </h5>
                  <p className="lead" style={{ opacity: '100%' }}>
                    <a className="btn btn-primary btn-lg" href="/products" role="button">
                      Shop Now
                    </a>
                  </p>
                </div>
                {/* Add additional sections or content as needed */}
              </div>


      }



    </div>
  );
};




export default AdminDashboard;
