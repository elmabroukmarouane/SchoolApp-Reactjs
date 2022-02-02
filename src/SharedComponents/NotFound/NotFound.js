import React, { Component } from "react";
import { Link } from "react-router-dom";

export class NotFound extends Component {
    render() {
        return (
            <div className="text-center">
                <h1 className="fw-bold text-decoration-underline text-primary">404, Not Found :( !</h1>
                <Link to="/home" className="nav-link text-white">Home</Link>
            </div>
        );
    }
}