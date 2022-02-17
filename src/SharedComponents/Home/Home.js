import React, { Component } from "react";
import AuthenticationService from "../../Business/Services/AuthenticationService/AuthenticationService";

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthenticationService.getCurrentUser()
        }
    }
    render() {
        return (
            <div>
                <h1 className="fw-bold text-decoration-underline text-primary text-center">This home page</h1>
                <br />
                <div className="text-center">
                    Hi {this.state.currentUser.person.firstname} {this.state.currentUser.person.lastname}
                    <br /> your are {
                        this.state.currentUser.isOnline
                            ? <span>Connected</span>
                            : <span>Not Connected</span>
                    }
                </div>
            </div>

        );
    }
}