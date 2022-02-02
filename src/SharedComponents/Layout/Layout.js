import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivateRoute from "../../Routes/PrivateRoute";

import { Home } from '../Home/Home';
import { Level } from '../Level/Level';
import { Login } from '../Login/Login';
import { NotFound } from "../NotFound/NotFound";

import AuthenticationService from "../../Business/Services/AuthenticationService/AuthenticationService";


export class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: window.location,
            isAuthenticated: AuthenticationService.getToken()
        }
    }

    logout(e) {
        if (window.confirm('Are you sure to logout ?')) {
            e.preventDefault();
            AuthenticationService.logout();
            this.setState({
                isAuthenticated: null
            });
            window.history.pushState({}, "", "/login");
        }
    }

    render() {
        return (
            <Router>
                <div>
                    {
                        (this.state.location.pathname !== "/login" && this.state.isAuthenticated) &&
                        <nav className="navbar navbar-expand-sm navbar-light bg-primary">
                            <div className="container-fluid">
                                <a className="navbar-brand text-white" href="javscript:void(0)">SchoolApp</a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarID"
                                    aria-controls="navbarID" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarID">
                                    <div className="navbar-nav">
                                        <Link to="/home" className="nav-link text-white">Home</Link>
                                    </div>
                                    <div className="navbar-nav">
                                        <Link to="/level" className="nav-link text-white">Level</Link>
                                    </div>
                                    <div className="navbar-nav">
                                        <Link to="/oops" className="nav-link text-white">Not Found</Link>
                                    </div>
                                    <div className="navbar-nav float-end">
                                        <span className="nav-link text-white" style={{ cursor: "pointer" }} onClick={(e) => this.logout(e)}>Logout</span>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    }
                    <Routes>
                        <Route exact path='/home' element={<PrivateRoute />}>
                            <Route exact path='/home' element={<Home />} />
                        </Route>
                        <Route exact path='/' element={<PrivateRoute />}>
                            <Route exact path='/' element={<Home />} />
                        </Route>
                        <Route exact path='/level' element={<PrivateRoute />}>
                            <Route exact path='/level' element={<Level />} />
                        </Route>
                        <Route exact path='/login' element={<Login />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </div>
            </Router >
        );
    }
}