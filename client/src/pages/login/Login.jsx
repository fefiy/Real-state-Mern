import React, { useState, useContext, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [sign_up_mode, setSign_up_mode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser !== null) {
      navigate("/");
    }
  });
  return (
    <div className={`container  ${sign_up_mode && "sign-up-mode"}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <LoginForm />
          <RegisterForm />
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Discover your dream rental property on our website! Register now
              to access a wide range of listings tailored to your preferences.
              Enjoy a seamless experience, save favorites, and connect with
              property owners or agents. Find your perfect home today!
            </p>
            <button
              onClick={() => setSign_up_mode(true)}
              className="btn transparent"
              id="sign-up-btn">
              Sign up
            </button>
          </div>
          <img src="img/log.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Log in now to access a personalized rental experience. Easily
              manage saved properties, get updates on new listings, and
              communicate with ease. Don't miss out on your ideal rental
            </p>
            <button
              onClick={() => setSign_up_mode(false)}
              className="btn transparent"
              id="sign-in-btn">
              Sign in
            </button>
          </div>
          <img src="img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
