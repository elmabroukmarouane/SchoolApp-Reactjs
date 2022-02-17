import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import LevelService from "../../Business/Services/LevelService/LevelService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareUp, faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import { HubConnectionBuilder } from '@microsoft/signalr';
import AuthenticationService from '../../Business/Services/AuthenticationService/AuthenticationService';
import { config } from "../../Configurations/config";
import { LogLevel, HttpTransportType } from '@microsoft/signalr'

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
            currentUser: AuthenticationService.getCurrentUser(),
            modalTitle: "",
            selectedIndexLevel: 0,
            showModal: false,
            filterValue: "",
            levelsWithoutFilter: []
        }
    }

    get() {
        LevelService.get()
            .then((result) => {
                this.setState({
                    levels: result.data,
                    levelsWithoutFilter: result.data
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
        const newConnection = new HubConnectionBuilder()
            // .withUrl(config.HUB_URL + 'hubs/realtimehub', { transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling })
            .withUrl(config.HUB_URL + 'hubs/realtimehub', {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();
        this.setState({
            connection: newConnection,
            senderUserId: newConnection.connectionId,
        });
        newConnection.start()
            .then(result => {
                this.state.connection.on('Message', message => {
                    console.log(message);
                });
                this.state.connection.on('SendToAll', entites => {
                    let levels = this.state.levels;
                    levels.push(entites);
                    this.setState({
                        levels: levels
                    });
                });
                this.state.connection.on('UpdateToAll', entites => {
                    let levels = this.state.levels;
                    const updatedIndexEntity = levels.findIndex(
                        (level) => level.id === entites.id
                    );
                    if (updatedIndexEntity !== -1) levels[updatedIndexEntity] = entites;
                    this.setState({
                        levels: levels
                    });
                });
                this.state.connection.on('DeleteToAll', index => {
                    let levels = this.state.levels;
                    levels.splice(index, 1);
                    this.setState({
                        levels: levels
                    });
                });
            })
            .catch(e => console.log('Connection failed: ', e));
    }

    filterTableByAll = (e) => {
        this.setState({ filterValue: e.target.value });
        if (e.target.value === "") {
            this.setState({ levels: this.state.levelsWithoutFilter });
        } else {
            var filteredData = this.state.levelsWithoutFilter.filter(
                (el) => {
                    return el.id.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1
                        || el.levelname.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1;
                }
            );
            this.setState({ levels: filteredData });
        }
    }

    filterTableByField = (e, field) => {
        this.setState({ filterValue: e.target.value });
        if (e.target.value === "") {
            this.setState({ levels: this.state.levelsWithoutFilter });
        } else {
            var filteredData = this.state.levelsWithoutFilter.filter(
                (el) => {
                    if (field === "id") return el.id.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1
                    else return el.levelname.toString().toLowerCase().indexOf(e.target.value.toString().toLowerCase()) > -1;
                }
            );
            this.setState({ levels: filteredData });
        }
    }

    sortResult(prop, asc) {
        var sortedData = this.state.levelsWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ levels: sortedData });
    }

    hideModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    bindLevelName = (e) => {
        let levelClone = this.state.level;
        levelClone.levelname = e.target.value;
        this.setState({ level: levelClone });
    }

    add() {
        this.setState({
            modalTitle: "Add Level",
            level: {
                id: 0,
                levelname: "",
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
        LevelService.Add(this.state.level)
            .then((result) => {
                // this.state.levels.push(result.data.Entity);
                // this.get();
                if (this.state.connection.state === "Connected") {
                    try {
                        this.state.connection.send("SendToAll", result.data.Entity);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else {
                    console.log("No connection to server yet.");
                }
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

    edit(selectedLevel) {
        let levelClone = {
            id: this.state.levels[selectedLevel].id,
            levelname: this.state.levels[selectedLevel].levelname,
            createdby: this.state.levels[selectedLevel].createdby,
            createdate: this.state.levels[selectedLevel].createdate,
            updatedby: this.state.currentUser.person.firstname + " " + this.state.currentUser.person.lastname,
            updatedate: this.state.levels[selectedLevel].updatedate,
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
                // let levelsClone = this.state.levels;
                // levelsClone[this.state.selectedIndexLevel] = result.data.Entity;
                // this.get();
                if (this.state.connection.state === "Connected") {
                    try {
                        this.state.connection.invoke("UpdateToAll", result.data.Entity);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else {
                    console.log("No connection to server yet.");
                }
                this.setState({
                    // levels: levelsClone,
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

    delete(selectedLevel) {
        if (window.confirm('Are you sure ?')) {
            LevelService.Delete(this.state.levels[selectedLevel].id)
                .then((result) => {
                    // let selectedLevelToDelete = this.state.levels[selectedLevel];
                    // let levelsClone = this.state.levels.filter(function (ele) {
                    //     return ele.id !== selectedLevelToDelete.id;
                    // });
                    // this.setState({
                    //     levels: levelsClone
                    // });
                    // this.get();
                    if (this.state.connection.state === "Connected") {
                        try {
                            this.state.connection.invoke("DeleteToAll", selectedLevel);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
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
                                    <th>Level Name  <FontAwesomeIcon icon={faCaretSquareUp} className="cusorsFilter" onClick={() => this.sortResult("levelname", true)} />  <FontAwesomeIcon icon={faCaretSquareDown} className="cusorsFilter" onClick={() => this.sortResult("levelname", false)} /></th>
                                    <th>Actions</th>
                                </tr>
                                <tr>
                                    <th>
                                        <input type="text" className="form-control" onChange={(e) => this.filterTableByField(e, "id")} />
                                    </th>
                                    <th><input type="text" className="form-control" onChange={(e) => this.filterTableByField(e, "levelname")} /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.levels.length > 0
                                        ? this.state.levels.map(
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
                <style>{"\
                    .cusorsFilter{\
                        cursor: pointer;\
                    }\
                "}</style>
            </div>
        );
    }
}