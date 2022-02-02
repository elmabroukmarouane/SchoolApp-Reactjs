import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import LevelService from "../../Business/Services/LevelService/LevelService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareUp, faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";

export class Level extends Component {
    constructor(props) {
        super(props);
        this.state = {
            levels: [],
            level: {
                id: 0,
                levelname: "",
                createdby: "",
                createdate: "",
                updatedby: "",
                updatedate: "",
                users: []
            },
            modalTitle: "",
            selectedIndexLevel: 0,
            showModal: false,
            filterValue: ""
        }
    }

    get() {
        LevelService.get()
            .then((result) => {
                this.setState({
                    levels: result.data
                });
            });
    }

    componentDidMount() {
        this.get();
    }

    hideModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    add() {
        this.setState({
            modalTitle: "Add Level",
            level: {
                id: 0,
                levelname: "",
                createdby: "User",
                createdate: LevelService.getDateNow(),
                updatedby: "User",
                updatedate: LevelService.getDateNow(),
                users: []
            },
            showModal: true
        });
    }

    bindLevelName = (e) => {
        let levelClone = this.state.level;
        levelClone.levelname = e.target.value;
        this.setState({ level: levelClone });
    }

    filterTableByAll = (e) => {
        this.setState({ filterValue: e.target.value });
        if(e.target.value === "") {
            this.get();
        } else {
            var filteredData = this.state.levels.filter(
                (el) => {
                    return parseInt(el.id) === parseInt(e.target.value)
                    || el.levelname.toString().toLowerCase() === e.target.value.toString().toLowerCase();
                }
            );
            this.setState({ levels: filteredData });
        }
    }

    create() {
        LevelService.Add(this.state.level)
            .then((result) => {
                this.state.levels.push(result.data.Entity);
                this.setState({
                    showModal: false
                });
                alert(result.data.Message);
            },
                (error) => {
                    alert(error.data.Message);
                });
    }

    edit(selectedLevel) {
        let levelClone = {
            id: this.state.levels[selectedLevel].id,
            levelname: this.state.levels[selectedLevel].levelname,
            createdby: this.state.levels[selectedLevel].createdby,
            createdate: this.state.levels[selectedLevel].createdate,
            updatedby: "User",
            updatedate: LevelService.getDateNow(),
            users: this.state.levels[selectedLevel].users
        };
        this.setState({
            modalTitle: "Edit Level",
            level: levelClone,
            selectedIndexLevel: selectedLevel,
            showModal: true
        });
    }

    update() {
        LevelService.Update(this.state.level)
            .then((result) => {
                let levelsClone = this.state.levels;
                levelsClone[this.state.selectedIndexLevel] = result.data.Entity;
                this.setState({
                    levels: levelsClone,
                    showModal: false
                });
                alert(result.data.Message);
            })
    }

    delete(selectedLevel) {
        if (window.confirm('Are you sure ?')) {
            LevelService.Delete(this.state.levels[selectedLevel].id)
                .then((result) => {
                    let selectedLevelToDelete = this.state.levels[selectedLevel];
                    let levelsClone = this.state.levels.filter(function (ele) {
                        return ele.id !== selectedLevelToDelete.id;
                    });
                    this.setState({
                        levels: levelsClone
                    });
                    alert(result.data.Message);
                },
                    (error) => {
                        alert(error.data.Message);
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
                                    <th>ID <FontAwesomeIcon icon={faCaretSquareUp} />  <FontAwesomeIcon icon={faCaretSquareDown} /></th>
                                    <th>Level Name  <FontAwesomeIcon icon={faCaretSquareUp} />  <FontAwesomeIcon icon={faCaretSquareDown} /></th>
                                    <th>Actions</th>
                                </tr>
                                <tr>
                                    <th>
                                        <input type="text" className="form-control" />
                                    </th>
                                    <th><input type="text" className="form-control" /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.levels.map(
                                        (level, index) =>
                                            <tr key={index}>
                                                <td> {level.id} </td>
                                                <td> {level.levelname}</td>
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
                            <span className="input-group-text">Level Name</span>
                            <input type="text" className="form-control"
                                value={this.state.level.levelname}
                                onChange={this.bindLevelName} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>

                        <button type="button" className="btn btn-secondary" onClick={() => this.hideModal()}>Close</button>
                        {
                            this.state.level.id === 0
                                ? <button type="button" className="btn btn-primary" onClick={() => this.create()}>Save</button>
                                : <button type="button" className="btn btn-primary" onClick={() => this.update()}>Save</button>
                        }
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}