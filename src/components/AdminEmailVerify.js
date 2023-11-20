import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'

function AdminEmailVerify() {
    const navigate = useNavigate()
    const params = useParams()
    const [searchParams] = useSearchParams();
    // searchParams.get("emailToken")
    useEffect(() => {
        // console.log("values:",values,"params",params.id)
        // console.log("process.env.REACT_APP_BACKENDURL",process.env.REACT_APP_BACKENDURL)
        try {
            const values = { emailToken: searchParams.get("emailToken") }
            axios.put(`${process.env.REACT_APP_BACKENDURL}/adminemailVerification/${params.id}?${createSearchParams(values)}`).then((transaction) => {
                if (transaction.data.message === 'Email Verified!') {
                    alert("Email Verified!" )
                    navigate(`/`)

                } else {
                    alert("Please Signup Again" )
                    // navigate(`/sigunup`)
                }
            }
            );
        } catch (error) {
            alert(error)
        }


    }, [])
    return (
        <div>Emailverify</div>
    )
}

export default AdminEmailVerify