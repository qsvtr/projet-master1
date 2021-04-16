import React, { Component } from "react";
import UserService from "../../services/user.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/auth.service";
import pinata from "../../utils/pinata"

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.handleAddSchool = this.handleAddSchool.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangeLogo = this.onChangeLogo.bind(this);
        this.state = {name: "", address: "", logo: "", loading: false, message: ""};
    }

    logo = {}

    componentDidMount() {
        UserService.getUserBoard()
            .then( () => {
                this.setState({connected: true})
            }, () => {
                this.props.history.push("/");
                window.location.reload();
            }
        );
    }

    onChangeName(e) {
        this.setState({name: e.target.value});
    }

    onChangeAddress(e) {
        this.setState({address: e.target.value});
    }

    onChangeLogo(e) {
        if (e.target.files[0]) {
            this.logo = e.target.files[0];
            this.setState({logo: e.target.value});
        }
    }

    async handleAddSchool(e) {
        e.preventDefault();
        this.setState({message: "", loading: true});
        this.form.validateAll();
        const logoSize = (this.logo.size / (1024*1024)).toFixed(3)
        const logoType = this.logo.type
        if (this.checkBtn.context._errors.length === 0 && logoSize > 0 && logoSize < 0.5 && logoType.includes('image')) {
            const hash = await pinata.pinPictureToIPFS(this.logo)
            AuthService.addSchool(this.state.name, this.state.address, hash)
                .then(res => {
                    console.log(res)
                    const resMessage = res.data.message
                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                })
                .catch(error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                })
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <div>
                <h1 className="text-center" >Add a school</h1>
                    {!this.state.connected
                        ? <p>not connected</p>
                        : <div className="col-md-12">
                            <div className="card card-container">
                                <Form onSubmit={this.handleAddSchool} ref={c => {this.form = c;}}>
                                    <div className="form-group">
                                        <label htmlFor="username">School Name:</label>
                                        <Input type="text" className="form-control" name="username" value={this.state.name}
                                               onChange={this.onChangeName} validations={[required]}/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">Wallet Address (0x)</label>
                                        <Input type="text" className="form-control" name="address"
                                               value={this.state.address} onChange={this.onChangeAddress} validations={[required]}/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="logo">School Logo (only image type &lt;0.5MB)</label>
                                        <input type={"file"} accept="image/*" className="form-control" name="logo"
                                               value={this.state.logo} onChange={this.onChangeLogo}/>
                                    </div>


                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" disabled={this.state.loading}>
                                            {this.state.loading && (<span className="spinner-border spinner-border-sm"/>)}
                                            <span>Add</span>
                                        </button>
                                    </div>

                                    {this.state.message && (
                                        <div className="form-group">
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.message}
                                            </div>
                                        </div>
                                    )}
                                    <CheckButton style={{ display: "none" }} ref={c => {this.checkBtn = c;}}/>
                                </Form>
                            </div>
                        </div>
                    }
            </div>
        );
    }
}
