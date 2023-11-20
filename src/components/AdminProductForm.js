import axios from 'axios';
import { useFormik, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons'

function ProductForm() {
  const userId = sessionStorage.getItem("userid")
  const token = sessionStorage.getItem("session")
  const loggedinAdmin = sessionStorage.getItem("loggedinAdmin");

  const [imageChanged, setImageChanged] = useState(false);
  const navigate = useNavigate()
  const [avatarPreview, setAvatarPreview] = useState();
  const [page, setPage] = useState("editPage");
  const [displayMessage, setDisplayMessage] = useState("")
  const [spinner, setSpinner] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [selectLocation, setSelectedLocation] = useState("")
  const resetimage = () => {
    setSpinner(false)
    setAvatarPreview('');
    const file = document.querySelector('#contained-button-file');
    if (file !== null) {
      file.value = '';
    }
  }
  useEffect(() => {
    createItemFormik.resetForm();
    resetimage();
  }, [])


  const createItemFormik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      availability: 0,
      category: "",
      file: "",
      location: "",
      quantity: 0,
      dateCreated: ""
    },
    validate: (values) => {
      console.log(values)
      let error = {};
      if (values.name === "") {
        error.name = "Please enter valid Name"
      }
      if (values.category === "") {
        error.category = "Please enter valid category"
      }
      if (values.price === 0) {
        error.price = "Please enter valid Item Cost"
      }
      if (imageFile === "") {
        error.file = "Please select Image"
      }
      if (values.dateCreated === "") {
        error.dateCreated = "Please enter valid Date"
      }
      if (values.location === "") {
        error.location = "Please enter valid location"
      }

      return error;
    },
    onSubmit: async (values) => {
      try {
        console.log("values", values)
        setSpinner(true);
        const formData = {
          name: values.name,
          price: values.price,
          availability: values.availability,
          category: values.category,
          file: imageFile,
          location: values.location,
          quantity: values.quantity,
          dateCreated: values.dateCreated
        }

        const result = await axios.post(
          `${process.env.REACT_APP_BACKENDURL}/upload-files`,
          formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': token,
            'User-Id': userId,
          }
        }
        )
        console.log(result);
        if (result.data.status == "ok") {
          // setPage("success")
          createItemFormik.resetForm();
          resetimage();
          setSpinner(false);
          setDisplayMessage("Updated Successfully")
        }




      }
      catch (error) {
        console.log("ERROR:", error)
        // TokenExpiredError
        alert(error.response.data.message)
      }

    }
  })

  return (

    <div className="container">
      <div className='card shadow mb-4 '>

        <div className="content">
          <form onSubmit={createItemFormik.handleSubmit}>
            <div class="bg-light my-1">
              <div class="container">
                <div class="row">
                  <div class="col-lg-9">
                    <div class="card border shadow-0">
                      <div class="border-top pt-4 mx-4 mb-4">
                        <form id="fileform">
                          <input
                            name='avatar'
                            accept='image/*'
                            id='contained-button-file'
                            type='file'
                            onChange={(e) => {
                              const fileReader = new FileReader();
                              fileReader.onload = () => {
                                if (fileReader.readyState === 2) {
                                  setAvatarPreview(fileReader.result);
                                  console.log(" fileReader", fileReader)
                                  console.log(" setAvatarPreview", avatarPreview)
                                  setImageChanged(true);
                                  createItemFormik.errors.file = false;
                                }
                              };
                              fileReader.readAsDataURL(e.target.files[0]);
                              setImageFile(e.target.files[0]);
                            }}
                          />
                        </form>
                        <h6 className='mb-3'><FontAwesomeIcon icon={faEye} /> Preview</h6>
                        {
                          createItemFormik.errors.file ? <><span style={{ color: 'red' }}>{createItemFormik.errors.file}</span> </> : null
                        }
                        <div className='d-flex row'>
                          <img src={avatarPreview}
                            class="border rounded me-3 col-lg-4 col-sm-12" style={{ width: '220px', height: ' 220px' }} />
                          <span className='imageDelete' onClick={() => {
                            setAvatarPreview('');
                          }}>
                            <FontAwesomeIcon icon={faTrash} />
                          </span>
                          <div className="col-lg-7 col-sm-12">
                            <h6>{createItemFormik.values.name}</h6>
                            <p>{createItemFormik.values.category}</p>
                            <h6>₹{createItemFormik.values.price}</h6>
                            {createItemFormik.values.availability !== 0 ? <h6 className='text-success'>Available Now</h6> : <h6 className='text-danger'>Out of stock</h6>}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3">
                    <div class="card shadow-0 border">
                      <div class="card-body">
                        <div className='container'>
                          <div className='row mb-2'>
                            <div className='col-lg-12 col-sm-12'>
                              <label for="name" className='mx-1'>Name</label>
                              <input type="text" id='name' placeholder='name' name='name'
                                className={`mb-2 w-100 show form-control ${createItemFormik.touched.name && createItemFormik.errors.name ? "border-danger" : ""} ${createItemFormik.touched.name && !createItemFormik.errors.name ? "border-secondary" : ""}`}
                                onChange={createItemFormik.handleChange}
                                value={createItemFormik.values.name} />
                              {
                                createItemFormik.touched.name && createItemFormik.errors.name ? <><span style={{ color: 'red' }}>{createItemFormik.errors.name}</span> </> : null
                              }
                            </div>
                            <div className='col-lg-12 col-sm-12'>
                              <label for="category" className='mx-1'>Category</label>
                              <input type="text" id='category' placeholder='category'
                                className={`mb-2 w-100 show form-control ${createItemFormik.touched.category && createItemFormik.errors.category ? "border-danger" : ""} ${createItemFormik.touched.category && !createItemFormik.errors.category ? "border-secondary" : ""}`}
                                onChange={createItemFormik.handleChange}
                                value={createItemFormik.values.category} />
                              {
                                createItemFormik.touched.category && createItemFormik.errors.category ? <><span style={{ color: 'red' }}>{createItemFormik.errors.category}</span> </> : null
                              }
                            </div>
                            <div className='col-lg-12 col-sm-12'>
                              <label for="price" className='mx-1'>Price</label>
                              <input type="number" id='price' placeholder='price'
                                className={`mb-2 w-100 show form-control ${createItemFormik.touched.price && createItemFormik.errors.price ? "border-danger" : ""} ${createItemFormik.touched.price && !createItemFormik.errors.price ? "border-secondary" : ""}`}
                                onChange={createItemFormik.handleChange}
                                value={createItemFormik.values.price} />
                              {
                                createItemFormik.touched.price && createItemFormik.errors.price ? <><span style={{ color: 'red' }}>{createItemFormik.errors.price}</span> </> : null
                              }
                            </div>
                            <div className='col-lg-12 col-sm-12'>
                              <label for="availability" className='mx-1'>Availability</label>
                              <input type="number" id='availability' placeholder='availability'
                                className={`mb-2 w-100 show form-control ${createItemFormik.touched.availability && createItemFormik.errors.availability ? "border-danger" : ""} ${createItemFormik.touched.availability && !createItemFormik.errors.availability ? "border-secondary" : ""}`}
                                onChange={createItemFormik.handleChange}
                                min='0'
                                value={createItemFormik.values.availability} />
                              {
                                createItemFormik.touched.availability && createItemFormik.errors.availability ? <><span style={{ color: 'red' }}>{createItemFormik.errors.availability}</span> </> : null
                              }
                            </div>
                            <div className='col-lg-12 col-sm-12'>
                              <label for="dateCreated" className='mx-1'>Date Created</label>
                              <input type="string" id='dateCreated' placeholder='YYYY-MM-DD'
                                className={`mb-2 w-100 show form-control ${createItemFormik.touched.dateCreated && createItemFormik.errors.dateCreated ? "border-danger" : ""} ${createItemFormik.touched.dateCreated && !createItemFormik.errors.dateCreated ? "border-secondary" : ""}`}
                                onChange={createItemFormik.handleChange}
                                value={createItemFormik.values.dateCreated} />
                              {
                                createItemFormik.touched.dateCreated && createItemFormik.errors.dateCreated ? <><span style={{ color: 'red' }}>{createItemFormik.errors.dateCreated}</span> </> : null
                              }
                            </div>
                            <div className='col-lg-12 col-sm-12'>
                              <label for="location" className='mx-1'>Choose Location:</label>

                              <select name="location"
                                className={`mb-2 w-100 show form-control ${createItemFormik.touched.location && createItemFormik.errors.location ? "border-danger" : ""} ${createItemFormik.touched.location && !createItemFormik.errors.location ? "border-secondary" : ""}`}
                                id="location" onChange={createItemFormik.handleChange} value={createItemFormik.values.location} >
                                <option value="">--Please choose an option--</option>
                                <option value="USA">USA</option>
                                <option value="India">India</option>
                                <option value="Japan">Japan</option>
                                <option value="China">China</option>
                                <option value="Taiwan">Taiwan</option>
                                <option value="Nepal">Nepal</option>
                              </select>
                              {
                                createItemFormik.touched.location && createItemFormik.errors.location ? <><span style={{ color: 'red' }}>{createItemFormik.errors.location}</span> </> : null
                              }
                            </div>
                          </div>

                        </div>


                        <div class="mt-3">
                          <button className={spinner ? 'disabled btn btn-success w-100 shadow-0 mb-2' : 'btn btn-success w-100 shadow-0 mb-2'} type={"submit"}>Create Item</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}




export default ProductForm


