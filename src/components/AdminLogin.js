import React, { useContext, useState } from 'react';
import { useFormik } from "formik"
import axios from 'axios'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'

function AdminLogin({ onLogin }) {
  const userId = useContext(UserContext)
  const navigate = useNavigate()
  const [displayLoader, setdisplayLoader] = useState(false)

  const loginForm = useFormik({
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
      try {
        setdisplayLoader(true)
        const user = await axios.post(`${process.env.REACT_APP_BACKENDURL}/user/adminlogin`, values)
        console.log("user",user)
        onLogin()
        if (user.data.message === "Success Auth") {
          sessionStorage.setItem("session", user.data.token)
          sessionStorage.setItem("userid", user.data.user_id)
          sessionStorage.setItem("loggedinAdmin", true)
          userId.setcounter(user.data.user_id)
          const searchValues = {
            page: 0
          }
          navigate(`/admindashboard`)
          // const context = useContext(UserContext)
          // navigate({ pathname: `/home/${user.data.user_id}`, search: `?${createSearchParams(userId.transactionDate)}` });
        } else {
          alert(user.data.message)
        }
        setdisplayLoader(false)
      } catch (error) {
        console.log("ERROR:", error)
        setdisplayLoader(false)
        alert(error.message)
      }
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
                      <h4 className="mt-1 mb-1 pb-1">Admin- Login</h4>
                    </div>
                    <form onSubmit={loginForm.handleSubmit}>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example11">Username</label>
                        <input type="email"
                          name="username"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.username}
                          id="form2Example11"
                          className={`form-control ${loginForm.touched.username && loginForm.errors.username ? "error-box" : ""} ${loginForm.touched.username && !loginForm.errors.username ? "success-box" : ""}`}
                          placeholder="Email address" />
                        {
                          loginForm.touched.username && loginForm.errors.username ? <span style={{ color: 'red' }}>{loginForm.errors.username}</span> : null
                        }
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example22">Password</label>
                        <input type="password"
                          name="password"
                          placeholder="Password"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.password}
                          id="form2Example22"
                          className={`form-control ${loginForm.touched.password && loginForm.errors.password ? "error-box" : ""} ${loginForm.touched.password && !loginForm.errors.password ? "success-box" : ""}`} />
                        {
                          loginForm.touched.password && loginForm.errors.password ? <span style={{ color: 'red' }}>{loginForm.errors.password}</span> : null
                        }
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" disabled={displayLoader} type={"submit"}>Log
                          in</button>
                        <div className={"spinner-border center " + (displayLoader === true ? "d-block" : "d-none")} role="status" >
                          <span class="sr-only"></span>
                        </div>
                        <br />
                        <Link to={`/adminforgot-password`} className="text-muted">Forgot password?</Link>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <Link to={`/adminsignup`} className="btn btn-outline-danger">Create new</Link>
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

export default AdminLogin