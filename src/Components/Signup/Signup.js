import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import validate from "../../utils/validate";

import emailicon from "../../icons/emailicon.svg";
import passwordicon from "../../icons/passwordicon.svg";

import Input from "../Input/Input";
import Button from "../Button/Button";
import WithGoogle from "../WithGoogle/WithGoogle";

import SignupStyles from "./Signup.module.css";

export default function Singup() {
  const { userSignup, googleSignin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authError = errors && errors.auth;

  function handleEmail(e) {
    setEmail(e.target.value);
    if (errors) {
      errors.email = "";
    }
  }

  function handlePassword(e) {
    setPassword(e.target.value);
    if (errors) {
      errors.password = "";
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const { errors, valid } = validate(email, password);
    if (!valid) return setErrors(errors);

    try {
      setErrors({});
      setLoading(true);
      await userSignup(email, password);
      navigate("/");
      setLoading(false);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrors({ auth: "Email salready in use" });
      }
      console.log(err);
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      await googleSignin();
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <div className={SignupStyles.container}>
      <div className={SignupStyles.formcontainer}>
        <h1>Register!</h1>
        <p className={authError ? SignupStyles.red : ""}>
          {authError ? errors.auth : "Use your email or Google account"}
        </p>
        <form onSubmit={(e) => handleSignup(e)}>
          <Input
            type="email"
            icon={emailicon}
            placeholder="Email"
            alt="Email"
            onChange={handleEmail}
          />
          {errors && errors.email && <p>{errors.email}</p>}
          <Input
            type="password"
            icon={passwordicon}
            placeholder="Password"
            alt="Password"
            onChange={handlePassword}
          />
          {errors && errors.password && <p>{errors.password}</p>}
          <Button type="submit" loading={loading} text="Signup" />
        </form>
        <div onClick={handleGoogle} className={SignupStyles.google}>
          <WithGoogle text="Sign in with Google" loading={loading} />
        </div>
        <div disabled={loading}>
          <p className={SignupStyles.login}>
            Don't have an account? &nbsp;
            <Link to="/login">
              <span className={SignupStyles.link}>Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
