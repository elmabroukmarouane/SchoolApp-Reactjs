import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import AuthenticationService from "../../Business/Services/AuthenticationService/AuthenticationService";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLogin: {
                email: "",
                password: ""
            },
            emailBinded: false,
            passwordBinded: false,
            logged: "info",
            message: ""
        }
    }

    bindEmail = (e) => {
        let userLoginClone = this.state.userLogin;
        userLoginClone.email = e.target.value;
        this.setState({ userLogin: userLoginClone, emailBinded: true });
    }

    bindPassword = (e) => {
        let userLoginClone = this.state.userLogin;
        userLoginClone.password = e.target.value;
        this.setState({ userLogin: userLoginClone, passwordBinded: true });
    }

    Login() {
        AuthenticationService.Login(this.state.userLogin)
            .then((result) => {
                this.setState({
                    logged: "success",
                    message: result.Message
                });
                // setTimeout(() => {
                //     // window.history.pushState({}, "", "/home");
                //     // window.location.assign("/home");
                //     console.log('<Navigate to="/home" />')
                //     return <Navigate to="/home" />;
                // }, 5000);
                window.location.assign("/home");
            },
                (error) => {
                    if (error.response.status === 401) {
                        this.setState({
                            logged: "error",
                            message: error.response.data.Message
                        });
                    }
                });
    }

    checkLogin() {
        if (this.state.emailBinded && this.state.passwordBinded) this.Login();
    }

    render() {
        return (
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid"
                                alt="Sample" />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            {
                                this.state.logged === "info"
                                    ? <div className="alert alert-info alert-dismissible fade show" role="alert">
                                        <strong>Information : </strong> Enter your Email and Password
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                    : this.state.logged === "success"
                                        ? <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            <strong>Success : </strong> {this.state.message}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                        : <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            <strong>Error : </strong> {this.state.message}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                            }
                            <form>
                                <div className="form-outline mb-4">
                                    <input type="email" id="form3Example3" className="form-control form-control-lg"
                                        placeholder="Enter a valid email address"
                                        onChange={this.bindEmail} required />
                                    <label className="form-label" htmlFor="form3Example3">Email address</label>
                                </div>
                                <div className="form-outline mb-3">
                                    <input type="password" id="form3Example4" className="form-control form-control-lg"
                                        placeholder="Enter password"
                                        onChange={this.bindPassword} required />
                                    <label className="form-label" htmlFor="form3Example4">Password</label>
                                </div>

                                <div className="text-center text-lg-start mt-4 pt-2">
                                    <button type="button" className="btn btn-primary btn-lg"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        onClick={() => this.checkLogin()}>Login</button>
                                    <p className="small fw-bold mt-2 pt-1 mb-0">

                                    </p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </section>
        );
    }
}