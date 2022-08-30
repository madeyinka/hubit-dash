import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, FormGroup, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import noAuth from "../../hooks/noAuth";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const {setAuth} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const from = location.state?.from?.pathname || "/dashboard"

  const onFormSubmit = async (formData) => {
    setLoading(true);
    try {
      await noAuth.post('/auth/login', formData)
      .then((result) => {
        if (result && result.data.success) {
          setAuth({token: result.data.data.token})
          navigate(from, {replace: true})
        } 
      })
    } catch (err) {
      setTimeout(() => {
        //console.log(err)
        setError(err.response?.data?.message);
        setLoading(false);
      }, 2000);
    } 
  };

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                <BlockDes>
                  <p>Sign in to access your dashboard.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> {errorVal}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="email-address">
                    Email 
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="email-address"
                    name="email"
                    ref={register({ required: "This field is required" })}
                    // defaultValue="info@softnio.com"
                    placeholder="Enter your email address"
                    className="form-control-lg form-control"
                  />
                  {errors.email && <span className="invalid">{errors.email.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/forgot-password`}>
                    Forgot Password?
                  </Link>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="password"
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your password"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.password && <span className="invalid">{errors.password.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </FormGroup>
            </Form>
            {/* <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div>  */}
            {/* <div className="text-center pt-4 pb-3">
              <h6 className="overline-title overline-title-sap">
                <span>OR</span>
              </h6>
            </div> */}
            {/* <ul className="nav justify-center gx-4">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Facebook
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Google
                </a>
              </li>
            </ul> */}
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
