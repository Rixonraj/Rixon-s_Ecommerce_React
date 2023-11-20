// src/components/ProductDetails.js
import React from 'react';

const ProductDetails = ({ addToCart, updateQuantity, productQuantities, cartItems, productDetails }) => {
    // Extract product ID from the URL parameters

    // Fetch product details based on the ID (replace this with your actual data fetching logic)
    // const productDetails = {
    //     id: parseInt(id), name: `Product ${id}`, price: 20, category: 'Electronics', location: 'USA', dateCreated: '2023-01-01', availability: 10,

    // };
    console.log("productDetails", productDetails)
    const handleQuantityChange = (quantity) => {
        updateQuantity(productDetails._id, quantity);
    };

    const incrementQuantity = () => {
        const currentQuantity = productQuantities[productDetails._id] || 0;
        handleQuantityChange(currentQuantity + 1);
    };

    const decrementQuantity = () => {
        const currentQuantity = productQuantities[productDetails._id] || 0;
        if (currentQuantity > 0) {
            handleQuantityChange(currentQuantity - 1);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Product Details</h2>
            <div>
                <div className='row'>
                    <div className='col-xl-4 col-sm-12'>
                        <h4>{productDetails.name}</h4>
                        <img
                            src={`${process.env.REACT_APP_BACKENDURL}/files/${productDetails.fileName}`}
                            alt={productDetails.name}
                            className=""
                            height={'500px'}
                            width={'400px'}
                        />
                    </div>
                    <div className='col-xl-6 col-sm-12'>
                        <div className="mb-3">
                            <label htmlFor={`quantity-${productDetails._id}`} className="mr-2">
                                Quantity:
                            </label>
                            <div className="quantity-control mb-3">
                                <button
                                    className="quantity-button"
                                    onClick={decrementQuantity}
                                    disabled={(productQuantities[productDetails._id] || 0) < 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    id={`quantity-${productDetails.id}`}
                                    value={productQuantities[productDetails._id] || 0}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                                    min="1"
                                />
                                <button
                                    className="quantity-button"
                                    onClick={incrementQuantity}
                                    disabled={(productQuantities[productDetails._id] || 0) >= productDetails.availability}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click from triggering
                                    addToCart(productDetails);
                                }}
                                disabled={cartItems.some((item) => item._id === productDetails.id) || (productQuantities[productDetails._id] || 0) === 0}
                            >
                                {cartItems.some((item) => item._id === productDetails._id) ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>
                        <div className='d-flex' style={{alignItems: "self-end"}}>
                        <h4>Price : </h4> <h6> $ {productDetails.price}</h6>
                        </div>
                        <div className='d-flex' style={{alignItems: "self-end"}}>
                        <h4>Availabile units : </h4> <h6> {productDetails.availability}</h6>
                        </div>
                        <div className='d-flex' style={{alignItems: "self-end"}}>
                        <h4>Category : </h4><h6> {productDetails.category}</h6>
                        </div>
                        <div className='d-flex' style={{alignItems: "self-end"}}>
                        <h4>Location : </h4> <h6> {productDetails.location}</h6>
                        </div>
                       
                    </div>
                </div>


            </div>

        </div>
    );
};

export default ProductDetails;
