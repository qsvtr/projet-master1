import React, { Component } from "react";
import UserService from "../../services/user.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/auth.service";
import axios from "axios"

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
        this.state = {name: "", address: "", logo: "", loading: false, message: "", error: ""};
    }
    logo = {}
    privateKey = ""

    async pinPictureToIPFS(logo) {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const data = new FormData();
        data.append('file', logo);
        return axios.post(url, data, {
            maxContentLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': "027a3a5204bf3ff59ffc",
                'pinata_secret_api_key': "b8c59aef2458bb2f4015b6f2624e32fb9eab4c1635d5c1fcd2336b32646453f3"
            }
        })
            .then(res => "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash)
            .catch(err => console.log('error1'));
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
    async exportCryptoKey(key, type) {
        let exported
        if (type === "private") {
            exported = await window.crypto.subtle.exportKey("pkcs8", key);
        } else {
            exported = await window.crypto.subtle.exportKey("spki", key);
        }
        const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exported));
        const exportedAsBase64 = window.btoa(exportedAsString);
        let value = ""
        if (type === "private") {
            value = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`
        } else {
            value = `-----BEGIN PUBLIC KEY-----${exportedAsBase64}-----END PUBLIC KEY-----`;
        }
        return value
    }

    downloadPrivateKey = async (e) => {
        e.preventDefault();
        const element = document.createElement("a");
        const file = new Blob([this.privateKey], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "privateKey.pcm";
        element.click()
    }

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
            const logo_url = await this.pinPictureToIPFS(this.logo)
            const key = await  window.crypto.subtle.generateKey(
                {name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256",},
                true, ["sign", "verify"])
            this.privateKey = await this.exportCryptoKey(key.privateKey, 'private');
            const publicKey = await this.exportCryptoKey(key.publicKey, 'public');
            AuthService.addSchool(this.state.name, this.state.address, logo_url, publicKey)
                .then(res => {
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
                        error: resMessage
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
                                        <label htmlFor="logo">School Logo (only image type &lt;0.5MB / best ratio w:2/h:1)</label>
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
                                            <div className="alert alert-success" role="alert">
                                                {this.state.message}
                                            </div>
                                            <button onClick={this.downloadPrivateKey}>Download your private key</button>
                                        </div>
                                    )}
                                    {this.state.error && (
                                        <div className="form-group">
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.error}
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
