import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import { validateLogin } from "../../utils/validate";

import Input from "../Input/Input";
import Button from "../Button/Button";

import emailicon from "../../icons/emailicon.svg";
import passwordicon from "../../icons/passwordicon.svg";

import LoginStyles from "./Login.module.css";
import WithGoogle from "../WithGoogle/WithGoogle";
import googleSignin from "../../utils/googleSignin";

export default function Login() {
  const { userLogin, withGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
    console.log(password);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const { errors, valid } = validateLogin(email, password);

    if (!valid) {
      return setErrors(errors);
    }

    try {
      setErrors();
      setLoading(true);
      await userLogin(email, password);
      setLoading(false);
      history.push("/");
    } catch (err) {
      console.log(err);
      if (err.code === "auth/user-not-found") {
        setErrors({ ...errors, auth: "User not found" });
      }
      if (err.code === "auth/wrong-password") {
        setErrors({ ...errors, auth: "Wrong password" });
      }
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      await googleSignin(withGoogle);
      setLoading(false);
      history.push("/");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <div className={LoginStyles.container}>
      <div className={LoginStyles.formcontainer}>
        <h1>Log in</h1>
        <p className={authError ? LoginStyles.red : ""}>
          {authError ? errors.auth : "Enter your email and password below"}
        </p>
        <form onSubmit={(e) => handleLogin(e)}>
          <Input
            type="text"
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

          <Button type="submit" loading={loading} text="Login" />
        </form>
        <div onClick={() => handleGoogle()} className={LoginStyles.google}>
          <WithGoogle text="Sign in with Google" loading={loading} />
        </div>
        <div>
          <p className={LoginStyles.login}>
            Don't have an account? &nbsp;
            <Link to="/signup">
              <span>Signup</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
