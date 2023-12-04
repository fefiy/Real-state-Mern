import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { makeRequest } from '../../utils/axios';
import { BsFillPersonFill, BsFillLockFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
const RegisterForm = () => {
 const [msg, setMsg] = useState("")
  // Define the initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = async(values) => {
    try{
      const response = await makeRequest.post("/user/register", values)
      console.log(response)
      setMsg(response.data.message)
    }catch(err){
      console.log(err)
    }
  };

  // Initialize Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form className="sign-up-form" onSubmit={formik.handleSubmit}>
      <h2 className="title">Sign up</h2>
      <div className="input-field">
        <div>
          <BsFillPersonFill />
        </div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      {formik.touched.name && formik.errors.name ? (
        <div className="error">{formik.errors.name}</div>
      ) : null}
      <div className="input-field">
        <div>
          <MdEmail />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      {formik.touched.email && formik.errors.email ? (
        <div className="error">{formik.errors.email}</div>
      ) : null}
      <div className="input-field">
        <div>
         <BsFillLockFill />
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      {formik.touched.password && formik.errors.password ? (
        <div className="error">{formik.errors.password}</div>
      ) : null}
      {msg&& <div style={{color:red, fontSize:24, margin:4}}>{msg}</div>}
      <input type="submit" className="btn" value="Sign up" />
    </form>
  );
};

export default RegisterForm;
