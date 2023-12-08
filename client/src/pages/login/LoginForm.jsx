import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BsFillLockFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
const LoginForm = () => {
    // Define the initial form values
    const initialValues = {
      email: '',
      password: '',
    };
    const navigate = useNavigate()

    const {login, err} = useContext(AuthContext)
   const {currentUser} = useContext(AuthContext)
    // Define validation schema using Yup
    const validationSchema = Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().required('Password is required'),
    });
  
    const onSubmit = async(values) => {
      console.log("login")
      try{
        await login(values)
        if(currentUser !== null){
          navigate("/")
        }
      }catch(err){
       console.log(err)
      }
      console.log('Submitted values:', values);
    };
  
    // Initialize Formik
    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });
  
    return (
      <form className="sign-in-form" onSubmit={formik.handleSubmit}>
        <h2 className="title">Sign in</h2>
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
        <input type="submit" value="Login" className="btn solid" />

        {err && <div style={{color:"red", fontSize:24, margin:4}}>{err.message}</div>}
      </form>
    );
  };
  
  export default LoginForm;
  