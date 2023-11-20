import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import './ProductList.css';
import axios from 'axios';


const ProductList = ({ addToCart, updateQuantity, productQuantities, cartItems, markFavorite, favorites, setgetAllProducts, setproductDetails }) => {
    const [allProducts, setProducts] = useState('');

    const [currentProducts, setCurrentProducts] = useState();

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9); // Set the number of items per page
    const [sortType, setSortType] = useState('name'); // Default sorting by name
    const [locationFilter, setLocationFilter] = useState(""); // Default no location filter
    const [allLocations, setallLocations] = useState([]); // Add more locations as needed
    const [priceRange, setPriceRange] = useState([0, 100000]); // Default price range
    const [allCategories, setallCategories] = useState([]); // Add more locations as needed
    // var allCategories = [];
    const [categoryFilter, setCategoryFilter] = useState(''); // Default no Category filter
    const getData = async () => {
        const result = await axios.get(`${process.env.REACT_APP_BACKENDURL}/get-files`);
        console.log(result.data.data)
        setProducts(result.data.data)
        setgetAllProducts(result.data.data)
        const uniqueSet = new Set(result.data.data.map(({ location }) => location));
        const uniqueArray = [...uniqueSet];
        console.log(uniqueArray)
        setallLocations(uniqueArray);
        const uniqueSet1 = new Set(result.data.data.map(({ category }) => category));
        const uniqueArray1 = [...uniqueSet1];
        setallCategories(uniqueArray1);
        await handlesortfilters(result.data.data, sortType, locationFilter, priceRange, categoryFilter, currentPage)
        console.log("currentProducts", currentProducts)
    }
    useEffect(() => {
        getData();
        console.log(getData.data);
        console.log(allProducts)
    }, [])

    // Search


    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
            ? []
            : allProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(inputValue) ||
                    product.category.toLowerCase().includes(inputValue)
            );
    };

    const renderSuggestion = (suggestion) => (

        <Link to={`/products/${suggestion.id}`} style={{ width: '100%' }} className="suggestion-link">
            {suggestion.name}
        </Link>

    );

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestion }) => {
    };

    const inputProps = {
        placeholder: 'Search for products...',
        value: searchTerm,
        onChange: (event, { newValue }) => setSearchTerm(newValue),
    };

    //End Search
    const handleFavoriteClick = (productId) => {
        markFavorite(productId);
    };



    const [totalPages, setTotalPages] = useState()
    const handlesortfilters = async (allProducts, sortType, locationFilter, priceRange, categoryFilter, currentPage) => {
        console.log("allProducts", allProducts)
        console.log("locationFilter:", locationFilter)
        // Sort the entire product list based on the selected sorting option
        const sortedProducts = [...allProducts].sort((a, b) => {
            if (sortType === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortType === 'price') {
                return a.price - b.price;
            } else if (sortType === 'dateCreated') {
                return new Date(b.dateCreated) - new Date(a.dateCreated);
            } else if (sortType === 'availability') {
                return a.availability - b.availability;
            }
            return 0;
        });

        // Apply location filter
        const filteredProducts = sortedProducts
            .filter((product) => !locationFilter.length || locationFilter.includes(product.location))
            .filter((product) => !categoryFilter.length || categoryFilter.includes(product.category))
            .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);


        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentProducts(filteredProducts.slice(indexOfFirstItem, indexOfLastItem));

        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    }
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        handlesortfilters(allProducts, sortType, locationFilter, priceRange, categoryFilter, pageNumber)
    };

    const handleSortChange = (type) => {
        setSortType(type);
        setCurrentPage(1);// Reset to the first page when changing the sorting option
        handlesortfilters(allProducts, type, locationFilter, priceRange, categoryFilter, currentPage)

    };

    const handleLocationFilterChange = (location) => {
        setLocationFilter(location);
        setCurrentPage(1);
        handlesortfilters(allProducts, sortType, location, priceRange, categoryFilter, currentPage)
    };

    const handleCategoryFilterChange = (category, cat) => {
        console.log("category", category, cat)
        setCategoryFilter((prevFilter) =>
            prevFilter.includes(category) ? prevFilter.filter((item) => item !== category) : [...prevFilter, category]
        );
        setCurrentPage(1);
        handlesortfilters(allProducts, sortType, locationFilter, priceRange, cat ? "" : category, currentPage)
    };

    const handlePriceRangeChange = (priceRange) => {
        setPriceRange(priceRange);
        handlesortfilters(allProducts, sortType, locationFilter, priceRange, categoryFilter, currentPage)

    };

    return (
        <div className="container mt-4">
            <h2>Product List</h2>
            <div className="container border border-dark rounded p-3 mb-3">

                {/* Search Bar */}
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    onSuggestionSelected={onSuggestionSelected}
                    getSuggestionValue={(suggestion) => suggestion.name}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />



                {/* Sorting */}
                <div className="mb-3">
                    <label htmlFor="sortSelect" className="mr-2">
                        Sort by:
                    </label>
                    <select
                        id="sortSelect"
                        className="form-control"
                        value={sortType}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="dateCreated">Date Created</option>
                        <option value="availability">Availability</option>
                        {/* Add more sorting options as needed */}
                    </select>
                </div>

                {/* Location Filter */}
                <div className="mb-3">
                    <label>Filter by Location:</label>
                    <div>
                        {allLocations.map((location) => (
                            <div key={location} className="form-check" style={{ width: 'fit-content' }}>
                                <input
                                    type="radio"
                                    id={`location-${location}`}
                                    className="form-check-input"
                                    value={location}
                                    checked={locationFilter === location}
                                    onChange={() => handleLocationFilterChange(location)}
                                />
                                <label htmlFor={`location-${location}`} className="form-check-label">
                                    {location}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Category Filter */}
                <div className="mb-3">
                    <label>Filter by Category:</label>
                    <div>
                        {allCategories?.map((category, index) => (
                            <div key={`${category}${index}`} className="form-check form-check-inline">
                                <input
                                    type="checkbox"
                                    id={`location-${category}`}
                                    className="form-check-input"
                                    checked={categoryFilter.includes(category)}
                                    onChange={() => handleCategoryFilterChange(category, categoryFilter.includes(category))}
                                />
                                <label htmlFor={`category-${category}`} className="form-check-label">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-3">
                    <label>Filter by Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
                    <div className="d-flex align-items-center">
                        <input
                            type="range"
                            className="form-range mr-2"
                            min={0}
                            max={100}
                            step={1}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange([parseInt(e.target.value, 10), priceRange[1]])}
                        />
                        <span>{priceRange[0]}</span>
                    </div>
                    <div className="d-flex align-items-center mt-2">
                        <input
                            type="range"
                            className="form-range mr-2"
                            min={0}
                            max={100}
                            step={1}
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value, 10)])}
                        />
                        <span>{priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Product listing */}
            <div className="row">
                {currentProducts?.map((product) => (
                    <div key={product._id} className="col-md-4 mb-4">
                        <div className="card " key={`card-${product._id}`} style={{ width: 'fit-content' }}>
                            <Link to={`/productDetail`} key={`link-${product._id}`} onClick={() => setproductDetails(product)} className="card-link">
                                <img
                                    src={`${process.env.REACT_APP_BACKENDURL}/files/${product.fileName}`}
                                    alt={product.name}
                                    className=""
                                    height={'300px'}
                                    width={'300px'}
                                />
                            </Link>
                            <div className="card-body shadow">
                                <h5 className="card-title">{product.name}</h5>
                                {/* Add Favorite button */}
                                <button
                                    className={`btn btn-outline-primary ${favorites.includes(product._id) ? 'active' : ''}`}
                                    onClick={() => handleFavoriteClick(product._id)}
                                >
                                    {favorites.includes(product._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                </button>
                                <p className="card-text">Price: ₹{product.price}</p>
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
                                            className='quantity-input'
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
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click from triggering
                                        addToCart(product);
                                    }}
                                    disabled={cartItems.some((item) => item._id === product._id) || (productQuantities[product._id] || 0) === 0}
                                >
                                    {cartItems.some((item) => item._id === product._id) ? 'Added to Cart' : 'Add to Cart'}
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination">
                        {[...Array(totalPages).keys()].map((page) => (
                            <li key={page + 1} className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                                    {page + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );

};

export default ProductList;