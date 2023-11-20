import React from 'react';
import { Link } from 'react-router-dom';

const Favorites = ({ favorites, getallProducts, addToCart, updateQuantity, productQuantities, cartItems }) => {
  console.log("favorites", favorites)
  console.log("allProducts", getallProducts)
  return (
    <div className="container mt-4">
      <h2>Favorite Products</h2>
      {favorites.length === 0 ? <p> Favorites is Empty, Add some !</p> :
        <div className="row">
          {favorites?.map((productId) => {
            const product = getallProducts.find((p) => p._id === productId);

            if (!product) {
              return null; // Handle the case where the product is not found
            }

            return (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card">
                  <Link to={`/products/${product._id}`} className="card-link">
                    <img
                      src={`${process.env.REACT_APP_BACKENDURL}/files/${product.fileName}`}
                      alt={product.name}
                      className="card-img-top"
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Price: ${product.price}</p>
                    <div className="d-flex align-items-center mb-2">
                      <label htmlFor={`quantity-${product._id}`} className="mr-2">
                        Quantity:
                      </label>
                      <div className="quantity-control d-flex">
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(product._id, (productQuantities[product._id] || 0) - 1)}
                          disabled={(productQuantities[product._id] || 0) < 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="quantity-input"
                          id={`quantity-${product._id}`}
                          value={productQuantities[product._id] || 0}
                          onChange={(e) => updateQuantity(product._id, parseInt(e.target.value, 10))}
                          min="1"
                        />
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(product._id, (productQuantities[product._id] || 0) + 1)}
                          disabled={(productQuantities[product._id] || 0) >= product.availability}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                      disabled={cartItems.some((item) => item._id === product._id) || (productQuantities[product._id] || 0) === 0}
                    >
                      {productQuantities[product._id] === 0 ? 'Out of Stock' : (cartItems.some((item) => item._id === product._id) ? 'Added to Cart' : 'Add to Cart')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
};

export default Favorites;
