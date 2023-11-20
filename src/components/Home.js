import React from 'react';
const Home = () => {


  return (

    <div className="">
      <div className="jumbotronStyle" >
        
        
      </div>

      <div className='contentjombo'>
        <h1 className="" >Welcome to My E-Commerce Store</h1>
        <h5 className="" >
          Explore a wide range of products <br/>
          &<br/>
          find the perfect items for you.
        </h5>
        <hr className="my-4" />
        <h4 >
          We offer high-quality products with fast <br/>
          &<br/> secure shipping.
          <br/>
          <br/>
          <br/>
          </h4>
          <h5>
          Shop with confidence!
        </h5>
        <p className="lead" style={{ opacity:'100%'}}>
          <a className="btn btn-primary btn-lg" href="/products" role="button">
            Shop Now
          </a>
        </p>
        </div>
      {/* Add additional sections or content as needed */}
    </div>
  );
};

export default Home;
