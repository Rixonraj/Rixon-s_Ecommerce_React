import React, { useState } from 'react';
import { useFormik } from "formik"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const AdminSignUp = ({ onSignup }) => {
  const navigate = useNavigate()
  const [displayLoader, setdisplayLoader] = useState(false)
  const registerForm = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validate: (values) => {
      let error = {};
      if (values.username === "") {
        error.username = "please enter a User Name"
      }
      if (values.password === "") {
        error.password = "please enter Password"
      }
      return error;
    },
    onSubmit: async (values) => {
      setdisplayLoader(true)
      try {
        const user = await axios.post(`${process.env.REACT_APP_BACKENDURL}/user/adminregister`, values)
        if (user.data.message === "Success ceated") {
          navigate("/")
        } else {
          alert(user.data.message)
        }
      } catch (error) {
        alert(error.message)
      }
      setdisplayLoader(false)
    }
  })
  return (
    <section className="h-100 gradient-form" >
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-12">
                  <div className="card-body">
                    <div className="text-center">
                      {/* <img src={"as"}
                        style={{ width: "185px" }} alt="logo" /> */}
                      <h4 className="mt-1 mb-5 pb-1">Admin - Signup</h4>
                    </div>
                    <form onSubmit={registerForm.handleSubmit}>
                      <p>Create a New Account !</p>

                      <div className="form-outline mb-1">
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

                      <div className="form-outline mb-1">
                        <label className="form-label" htmlFor="form2Example22">Password</label>
                        <input type="password"
                          name="password"
                          onChange={registerForm.handleChange}
                          value={registerForm.values.password}
                          id="form2Example22"
                          placeholder='Password'
                          className={`form-control ${registerForm.touched.password && registerForm.errors.password ? "error-box" : ""} ${registerForm.touched.password && !registerForm.errors.password ? "success-box" : ""}`} />
                        {
                          registerForm.touched.password && registerForm.errors.password ? <span style={{ color: 'red' }}>{registerForm.errors.password}</span> : null
                        }
                      </div>

                      <div className="text-center pt-1 pb-1">
                        <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-2" disabled={displayLoader} type={"submit"}>Register</button>
                        <div className={"spinner-border center " + (displayLoader === true ? "d-block" : "d-none")} role="status" >
                          <span class="sr-only"></span>
                        </div>
                        <p className=''>OR</p>
                        <p>Remembered your password? <Link to={`/adminlogin`} className="btn  btn-outline-danger">Login</Link></p>
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
  )
}

export default AdminSignUp