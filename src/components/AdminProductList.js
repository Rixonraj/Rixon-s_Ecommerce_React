import React, { useEffect, useState } from 'react';
import './ProductList.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminEditProduct from './AdminEditProduct';

const ProductList = () => {
  const [allProducts, setProducts] = useState([]);
  const navigate = useNavigate();
  const loggedinAdmin = sessionStorage.getItem("loggedinAdmin");

  const getData = async () => {
    const result = await axios.get(`${process.env.REACT_APP_BACKENDURL}/get-files`);
    console.log(result.data.data)
    setProducts(result.data.data)
  }
  useEffect(() => {
    getData();
    console.log("getData.data");
    console.log(allProducts)
  }, [])



  return (
    <div className="row">
      {loggedinAdmin ? ( <div>
      {allProducts?.map((product) => (
        <div key={product._id} className="col-md-4 mb-4">
          <div className="card " style={{ width: 'fit-content' }}>
            <Link to={`/products/${product.id}`} className="card-link">
              <img
                src={product.fileName}
                alt={product.name}
                className=""
                height={'300px'}
                width={'300px'}
              />
            </Link>
            <div className="card-body shadow">
              <h5 className="card-title">{product.name}</h5>

              <p className="card-text">Price: ₹{product.price}</p>

              <AdminEditProduct item={product}></AdminEditProduct>
            </div>

          </div>
        </div>
      ))}</div>):(<h4>Login as Admin </h4>)}
    </div>
  );
};
export default ProductList;