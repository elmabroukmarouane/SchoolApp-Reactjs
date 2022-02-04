import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import RoleService from "../../Business/Services/RoleService/RoleService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareUp, faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import AuthenticationService from '../../Business/Services/AuthenticationService/AuthenticationService';

export class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Roles: [],
            Role: {
                id: 0,
                role: 1,
                title: "",
                description: "",
                createdby: "",
                createdate: "",
                updatedby: "",
                updatedate: "",
                users: []
            },
            currentUser: AuthenticationService.getCurrentUser(),
            modalTitle: "",
            selectedIndexRole: 0,
            showModal: false,
            filterValue: "",
            RolesWithoutFilter: []
        }
    }

    get() {
        RoleService.get()
            .then((result) => {
                this.setState({
                    Roles: result.data,
                    RolesWithoutFilter: result.data
                })
            })
            .catch((ex) => {
                if (ex.toString().toLowerCase().replace(/\s/g, "") === "error:networkerror".toString().toLowerCase()) {
                    window.history.pushState({}, "", "/login");
                }
            });
    }

    componentDidMount() {
        this.get();
    }

    getRoleTitle(role) {
        switch (role) {
            case 1:
                return "SUPER_ADMIN";
            case 2:
                return "ADMIN";
            case 3:
                return "PROFESSOR";
            case 4:
                return "STUDENT";
            case 5:
                return "USER";
            default:
                break;
        }
    }

    filterTableByAll = (e) => {
        this.setState({ filterValue: e.target.value });
        if (e.target.value === "") {
            this.setState({ Roles: this.state.RolesWithoutFilter });
        } else {
            var filteredData = this.state.RolesWithoutFilter.filter(
                (el) => {
                    return el.id.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1
                        || el.role.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1
                        || el.title.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1
                        || el.description.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1;
                }
            );
            this.setState({ Roles: filteredData });
        }
    }

    filterTableByField = (e, field) => {
        this.setState({ filterValue: e.target.value });
        if (e.target.value === "") {
            this.setState({ Roles: this.state.RolesWithoutFilter });
        } else {
            var filteredData = this.state.RolesWithoutFilter.filter(
                (el) => {
                    if (field === "id") return el.id.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1;
                    else if (field === "role") return el.role.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1;
                    else if (field === "title") return el.title.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1;
                    else return el.description.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1;
                }
            );
            this.setState({ Roles: filteredData });
        }
    }

    sortResult(prop, asc) {
        var sortedData = this.state.RolesWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ Roles: sortedData });
    }

    hideModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    bindRole = (e) => {
        let RoleClone = this.state.Role;
        RoleClone.role = e.target.value;
        this.setState({ Role: RoleClone });
    }

    bindTitle = (e) => {
        let RoleClone = this.state.Role;
        RoleClone.title = e.target.value;
        this.setState({ Role: RoleClone });
    }

    bindDescription = (e) => {
        let RoleClone = this.state.Role;
        RoleClone.description = e.target.value;
        this.setState({ Role: RoleClone });
    }

    add() {
        this.setState({
            modalTitle: "Add Role",
            Role: {
                id: 0,
                role: 0,
                title: "",
                description: "",
                createdby: this.state.currentUser.person.firstname + " " + this.state.currentUser.person.lastname,
                createdate: "",
                updatedby: this.state.currentUser.person.firstname + " " + this.state.currentUser.person.lastname,
                updatedate: "",
                users: []
            },
            showModal: true
        });
    }

    create() {
        RoleService.Add(this.state.Role)
            .then((result) => {
                // this.state.Roles.push(result.data.Entity);
                this.get();
                this.setState({
                    showModal: false
                });
                alert(result.data.Message);
            },
                (error) => {
                    alert(error.data.Message);
                })
            .catch((ex) => {
                if (ex.toString().toLowerCase().replace(/\s/g, "") === "error:networkerror".toString().toLowerCase()) {
                    window.history.pushState({}, "", "/login");
                }
            });
    }

    edit(selectedRole) {
        let RoleClone = {
            id: this.state.Roles[selectedRole].id,
            role: this.state.Roles[selectedRole].role,
            title: this.state.Roles[selectedRole].title,
            description: this.state.Roles[selectedRole].description,
            createdby: this.state.Roles[selectedRole].createdby,
            createdate: this.state.Roles[selectedRole].createdate,
            updatedby: this.state.currentUser.person.firstname + " " + this.state.currentUser.person.lastname,
            updatedate: this.state.Roles[selectedRole].updatedate,
            users: this.state.Roles[selectedRole].users
        };
        this.setState({
            modalTitle: "Edit Role",
            Role: RoleClone,
            selectedIndexRole: selectedRole,
            showModal: true
        });
    }

    update() {
        RoleService.Update(this.state.Role)
            .then((result) => {
                // let RolesClone = this.state.Roles;
                // RolesClone[this.state.selectedIndexRole] = result.data.Entity;
                this.get();
                this.setState({
                    // Roles: RolesClone,
                    showModal: false
                });
                alert(result.data.Message);
            })
            .catch((ex) => {
                if (ex.toString().toLowerCase().replace(/\s/g, "") === "error:networkerror".toString().toLowerCase()) {
                    window.history.pushState({}, "", "/login");
                }
            });
    }

    delete(selectedRole) {
        if (window.confirm('Are you sure ?')) {
            RoleService.Delete(this.state.Roles[selectedRole].id)
                .then((result) => {
                    // let selectedRoleToDelete = this.state.Roles[selectedRole];
                    // let RolesClone = this.state.Roles.filter(function (ele) {
                    //     return ele.id !== selectedRoleToDelete.id;
                    // });
                    // this.setState({
                    //     Roles: RolesClone
                    // });
                    this.get();
                    alert(result.data.Message);
                },
                    (error) => {
                        alert(error.data.Message);
                    })
                .catch((ex) => {
                    if (ex.toString().toLowerCase().replace(/\s/g, "") === "error:networkerror".toString().toLowerCase()) {
                        window.history.pushState({}, "", "/login");
                    }
                });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.add()}>Add</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        Search in all table <input type="text"
                                            className="form-control"
                                            value={this.state.filterValue}
                                            onChange={this.filterTableByAll}
                                            style={{ width: "30%" }} />
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col">
                        <table className="table table-bordered table-hover table-striped text-center">
                            <thead>
                                <tr>
                                    <th>ID <FontAwesomeIcon icon={faCaretSquareUp} className="cusorsFilter" onClick={() => this.sortResult("id", true)} />  <FontAwesomeIcon icon={faCaretSquareDown} className="cusorsFilter" onClick={() => this.sortResult("id", false)} /></th>
                                    <th>Role  <FontAwesomeIcon icon={faCaretSquareUp} className="cusorsFilter" onClick={() => this.sortResult("role", true)} />  <FontAwesomeIcon icon={faCaretSquareDown} className="cusorsFilter" onClick={() => this.sortResult("role", false)} /></th>
                                    <th>Title  <FontAwesomeIcon icon={faCaretSquareUp} className="cusorsFilter" onClick={() => this.sortResult("title", true)} />  <FontAwesomeIcon icon={faCaretSquareDown} className="cusorsFilter" onClick={() => this.sortResult("title", false)} /></th>
                                    <th>Description  <FontAwesomeIcon icon={faCaretSquareUp} className="cusorsFilter" onClick={() => this.sortResult("description", true)} />  <FontAwesomeIcon icon={faCaretSquareDown} className="cusorsFilter" onClick={() => this.sortResult("description", false)} /></th>
                                    <th>Actions</th>
                                </tr>
                                <tr>
                                    <th>
                                        <input type="text" className="form-control" onChange={(e) => this.filterTableByField(e, "id")} />
                                    </th>
                                    <th><input type="text" className="form-control" onChange={(e) => this.filterTableByField(e, "role")} /></th>
                                    <th><input type="text" className="form-control" onChange={(e) => this.filterTableByField(e, "title")} /></th>
                                    <th><input type="text" className="form-control" onChange={(e) => this.filterTableByField(e, "description")} /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.Roles.length > 0
                                        ? this.state.Roles.map(
                                            (Role, index) =>
                                                <tr key={index}>
                                                    <td> {Role.id} </td>
                                                    <td> {this.getRoleTitle(Role.role)}</td>
                                                    <td> {Role.title}</td>
                                                    <td> {Role.description}</td>
                                                    <td>
                                                        <button type="button"
                                                            className="btn btn-warning mr-1"
                                                            style={{ border: "3px solid #ffb407" }}
                                                            onClick={() => this.edit(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                            </svg>
                                                        </button>
                                                        &nbsp;
                                                        <button type="button"
                                                            className="btn btn-danger mr-1 text-white"
                                                            style={{ border: "3px solid #d22d3b" }}
                                                            onClick={() => this.delete(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                        )
                                        : <tr>
                                            <td colSpan="3" className="font-weight-bold">Not Found :( !</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal show={this.state.showModal}>
                    <Modal.Header>
                        <h5 className="modal-title" id="exampleModalLabel">{this.state.modalTitle}</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Role</span>
                            <select className="form-control" value={this.state.Role.role} onChange={this.bindRole}>
                                <option value="1">Super Administrator</option>
                                <option value="2">Administrator</option>
                                <option value="3">Professor</option>
                                <option value="4">Student</option>
                                <option value="5">User</option>
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Title</span>
                            <input type="text" className="form-control"
                                value={this.state.Role.title}
                                onChange={this.bindTitle} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Description</span>
                            <textarea className="form-control" onChange={this.bindDescription} value={this.state.Role.description}></textarea>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>

                        <button type="button" className="btn btn-secondary" onClick={() => this.hideModal()}>Close</button>
                        {
                            this.state.Role.id === 0
                                ? <button type="button" className="btn btn-primary" onClick={() => this.create()}>Save</button>
                                : <button type="button" className="btn btn-primary" onClick={() => this.update()}>Save</button>
                        }
                    </Modal.Footer>
                </Modal>
                <style>{"\
                    .cusorsFilter{\
                        cursor: pointer;\
                    }\
                "}</style>
            </div>
        );
    }
}