import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ onCheckout, checkoutDetails }) => {
   const user =  sessionStorage.getItem("session") ? true: false 
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
    });

    useEffect(() => {
        if (checkoutDetails) {
            setFormData(checkoutDetails)
        }
    })

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the user is logged in
        if (!user) {
            // If not logged in, redirect to the login page
            navigate('/login');
            return;
        }

        // Validate the form data
        if (Object.values(formData).some((value) => !value)) {
            setError('Please fill in all fields.');
            return;
        }

        // Call the onCheckout prop to pass the form details to App.js
        onCheckout(formData);

        // Reset the form after submission
        setFormData({
            fullName: '',
            address: '',
            city: '',
            zipCode: '',
        });

        // Navigate to the summary page
        navigate('/summary');
    };

    return (
        <div className="container mt-4">
            <h2>Shipping Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Address
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                        City
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="zipCode" className="form-label">
                        Zip Code
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary">
                    Proceed to Checkout
                </button>
            </form>
        </div>
    );
};

export default Checkout;
