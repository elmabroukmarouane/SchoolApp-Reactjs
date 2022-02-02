import React, { Component } from "react";
import moment from "moment";

export class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearApp: ''
        };
    }

    componentDidMount() {
        let currentYear = this.getCurrentYear();
        this.setState({
            yearApp: currentYear
        });
    }

    getCurrentYear() {
        return moment().format("YYYY").toString();
    }
    render() {
        return (
            <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                <div className="text-white mb-3 mb-md-0">
                    SchoolApp Copyright © { this.state.yearApp }. All rights reserved.
                </div>
            </div>
        );
    }
}