// ForgotPassword.js
import React, { useEffect, useState } from 'react';
import { useFormik } from "formik"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = ({isLoggedin}) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (isLoggedin) {
        navigate('/')
    }

})
  const [displayLoader, setdisplayLoader] = useState(false)
  const registerForm = useFormik({
    initialValues: {
      username: ""
    },
    validate: (values) => {
      let error = {};
      if (values.username === "") {
        error.username = "please enter a username"
      }
      return error;
    },
    onSubmit: async (values) => {
      setdisplayLoader(true)
      try {

        const user = await axios.put(`${process.env.REACT_APP_BACKENDURL}/forgotpassword`, values)
        if (user.status == 200) {
          alert("Email Sent Please Check")
          setdisplayLoader(false)
          navigate("/")
        } else {
          alert(user.data.message)
          setdisplayLoader(false)
        }
      } catch (error) {
        alert(error.message)
        setdisplayLoader(false)
      }
    }
  })

  return (
    <section className="h-100 gradient-form" >
      <div className="container  h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-12">
                  <div className="card-body ">
                    
                    <form onSubmit={registerForm.handleSubmit}>
                      <p>Forgot Password ?</p>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example11">Username</label>
                        <input type="email"
                          name="username"
                          onChange={registerForm.handleChange}
                          value={registerForm.values.username}
                          id="form2Example11"
                          className={`form-control ${registerForm.touched.username && registerForm.errors.username ? "error-box" : ""} ${registerForm.touched.username && !registerForm.errors.username ? "success-box" : ""}`}
                          placeholder="Email address" />
                        {
                          registerForm.touched.username && registerForm.errors.username ? <span style={{ color: 'red' }}>{registerForm.errors.username}</span> : null
                        }
                      </div>

                      <div className="text-center pt-1 pb-1">
                        <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-2" disabled={displayLoader} type={"submit"}>Reset Password</button>
                        <div className={"spinner-border center " + (displayLoader === true ? "d-block" : "d-none")} role="status" >
                          <span class="sr-only"></span>
                        </div>
                        <br />
                        <p className='mb-2'>OR</p>
                        <br />
                        {/* <Link to={`/`} className="btn  btn-outline-danger">Sign in</Link> */}
                        <p>Remembered your password? <Link to="/login">Login</Link></p>
                      </div>


                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
