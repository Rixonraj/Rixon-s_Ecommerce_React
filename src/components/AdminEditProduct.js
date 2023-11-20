import axios from 'axios';
import { useFormik, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons'

function AdminEditProduct(props) {
    console.log("props", props)
    const userId = sessionStorage.getItem("userid")
    const token = sessionStorage.getItem("session")
    const loggedinAdmin = sessionStorage.getItem("loggedinAdmin");

    const [closePopup, setclosePopup] = useState();
    const [imageChanged, setImageChanged] = useState(false);
    const navigate = useNavigate()
    const [avatarPreview, setAvatarPreview] = useState(`${process.env.REACT_APP_BACKENDURL}/files/${props.item.fileName}`);
    const [page, setPage] = useState("editPage");
    const [displayMessage, setDisplayMessage] = useState("")
    const [spinner, setSpinner] = useState(false);
    const resetimage = () => {
        setSpinner(false)
        setAvatarPreview('');
        const file = document.querySelector('#contained-button-file');
        if (file !== null) {
            file.value = '';
        }
    }

    const editItemFormik = useFormik({
        initialValues: {
            _id: props.item._id,
            name: props.item.name,
            price: props.item.price,
            availability: props.item.availability,
            category: props.item.category,
            fileName: props.item.fileName,
            location: props.item.location,
            quantity: 0,
            dateCreated: props.item.dateCreated
        },
        validate: (values) => {
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
            if (avatarPreview === "") {
                error.fileName = "Please select Image"
            }
            return error;
        },
        onSubmit: async (values) => {
            try {
                console.log("values", values)
                // /imageUpload URL GET METHOD HIT
                setSpinner(true);


                if (imageChanged) {
                    // const fileupload = document.querySelector('#contained-button-file');
                    // const uploadBody = fileupload.files[0];

                } else {
                    console.log("ImG nOT CHANGED")
                    const editBody = {
                        _id: values._id,
                        name: values.name,
                        price: values.price,
                        availability: values.availability,
                        category: values.category,
                        fileName: values.fileName,
                        location: values.location,
                        quantity: values.quantity,
                        dateCreated: values.dateCreated
                    }
                    const result = await axios.post(
                        `${process.env.REACT_APP_BACKENDURL}/editProduct`,
                        editBody, {
                            headers: {
                              'Authorization': token, 
                              'User-Id': userId, 
                            }
                          }
                    );
                    console.log(result);
                    if (result.data.message == "Updated!") {
                        setPage("success")
                        setSpinner(false);
                        setDisplayMessage("Updated Successfully")
                    }
                }



            }
            catch (error) {
                console.log("ERROR:", error)
                alert(error.response.data.message)
            }

        }
    })

    return (
        <Popup
            trigger={
                <button type="button" className='btn btn-warning mx-1'>Edit</button>
            }
            onOpen={() => { setPage("createPage"); editItemFormik.resetForm(); setclosePopup(true); }}
            open={closePopup}
        >
            {close => (
                <div className="modal modal-dialog-centered">
                     {loggedinAdmin ? <div className='card shadow mb-4 popupcard popupcard1'>
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h4 className={`m-0 font-weight-bold `}>
                                Edit Item</h4>
                            <button className="close popupClose" onClick={close}>
                                &times;
                            </button>
                        </div>
                        {page == "createPage" ?
                            <div className="content">
                                <form onSubmit={editItemFormik.handleSubmit}>
                                    <div class="bg-light my-1">
                                        <div class="container">
                                            <div class="row">
                                                <div class="col-lg-9">
                                                    <div class="card border shadow-0">
                                                        <div class="border-top pt-4 mx-4 mb-4">
                                                            <form id="fileform">
                                                                {/* <input
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
                                                                                editItemFormik.errors.itemImage = false;
                                                                            }
                                                                        };
                                                                        fileReader.readAsDataURL(e.target.files[0]);
                                                                    }}
                                                                /> */}
                                                            </form>
                                                            <h6 className='mb-3'><FontAwesomeIcon icon={faEye} /> Preview</h6>
                                                            {
                                                                editItemFormik.errors.itemImage ? <><span style={{ color: 'red' }}>{editItemFormik.errors.itemImage}</span> </> : null
                                                            }
                                                            <div className='d-flex row'>
                                                                <img src={avatarPreview}
                                                                    class="border rounded me-3 col-lg-4 col-sm-12" style={{ width: '220px', height: ' 220px' }} />
                                                                {/* <span className='imageDelete' onClick={() => {
                                                                    setAvatarPreview('');
                                                                    const file = document.querySelector('#contained-button-file');
                                                                    file.value = '';
                                                                }}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </span> */}
                                                                <div className="col-lg-7 col-sm-12">
                                                                    <h6>{editItemFormik.values.name}</h6>
                                                                    <p>{editItemFormik.values.category}</p>
                                                                    <h6>₹{editItemFormik.values.price}</h6>
                                                                    {editItemFormik.values.availability !== 0 ? <h6 className='text-success'>Available Now</h6> : <h6 className='text-danger'>Out of stock</h6>}
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
                                                                            className={`mb-2 w-100 show form-control ${editItemFormik.touched.name && editItemFormik.errors.name ? "border-danger" : ""} ${editItemFormik.touched.name && !editItemFormik.errors.name ? "border-secondary" : ""}`}
                                                                            onChange={editItemFormik.handleChange}
                                                                            value={editItemFormik.values.name} />
                                                                        {
                                                                            editItemFormik.touched.name && editItemFormik.errors.name ? <><span style={{ color: 'red' }}>{editItemFormik.errors.name}</span> </> : null
                                                                        }
                                                                    </div>
                                                                    <div className='col-lg-12 col-sm-12'>
                                                                        <label for="category" className='mx-1'>Category</label>
                                                                        <input type="text" id='category' placeholder='category'
                                                                            className={`mb-2 w-100 show form-control ${editItemFormik.touched.category && editItemFormik.errors.category ? "border-danger" : ""} ${editItemFormik.touched.category && !editItemFormik.errors.category ? "border-secondary" : ""}`}
                                                                            onChange={editItemFormik.handleChange}
                                                                            value={editItemFormik.values.category} />
                                                                        {
                                                                            editItemFormik.touched.category && editItemFormik.errors.category ? <><span style={{ color: 'red' }}>{editItemFormik.errors.category}</span> </> : null
                                                                        }
                                                                    </div>
                                                                    <div className='col-lg-12 col-sm-12'>
                                                                        <label for="price" className='mx-1'>Price</label>
                                                                        <input type="number" id='price' placeholder='price'
                                                                            className={`mb-2 w-100 show form-control ${editItemFormik.touched.price && editItemFormik.errors.price ? "border-danger" : ""} ${editItemFormik.touched.price && !editItemFormik.errors.price ? "border-secondary" : ""}`}
                                                                            onChange={editItemFormik.handleChange}
                                                                            value={editItemFormik.values.price} />
                                                                        {
                                                                            editItemFormik.touched.price && editItemFormik.errors.price ? <><span style={{ color: 'red' }}>{editItemFormik.errors.price}</span> </> : null
                                                                        }
                                                                    </div>
                                                                    <div className='col-lg-12 col-sm-12'>
                                                                        <label for="availability" className='mx-1'>Availability</label>
                                                                        <input type="number" id='availability' placeholder='availability'
                                                                            className={`mb-2 w-100 show form-control ${editItemFormik.touched.availability && editItemFormik.errors.availability ? "border-danger" : ""} ${editItemFormik.touched.availability && !editItemFormik.errors.availability ? "border-secondary" : ""}`}
                                                                            onChange={editItemFormik.handleChange}
                                                                            min='0'
                                                                            value={editItemFormik.values.availability} />
                                                                        {
                                                                            editItemFormik.touched.availability && editItemFormik.errors.availability ? <><span style={{ color: 'red' }}>{editItemFormik.errors.availability}</span> </> : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                            </div>


                                                            <div class="mt-3">
                                                                <button className={spinner ? 'disabled btn btn-success w-100 shadow-0 mb-2' : 'btn btn-success w-100 shadow-0 mb-2'} type={"submit"}>Edit Item</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </form>
                            </div> :
                            <div className='content'>
                                <div class="bg-light my-1">
                                    <div class="container">
                                        <div class="row">
                                            <h3>{displayMessage}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div> : <h1>Login as Admin</h1>}
                    


                </div>
            )}
        </Popup>

    )
}
export default AdminEditProduct