import React, {Component} from "react";
import User from "../../services/user.service"

export default class SchoolList extends Component {
    constructor(props) {
        super(props);
        this.state = {schools: null, error: null, message: null, loading: false};
        this.fetchSchools()
    }

    fetchSchools = async () => {
        this.setState({message: "", loading: true});
        User.getSchools()
            .then(schools => {
                this.setState({schools: schools})
            })
            .catch(error => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                this.setState({loading: false, message: resMessage});
            })
    }


    render() {
        return (
            <div className="content mr-auto ml-auto">
                <h3>Schools list:</h3>
                <div className="row text-center">
                    <div className="col">
                        <div className="panel panel-pink">logo</div>
                    </div>
                    <div className="col">
                        <div className="panel panel-pink">name</div>
                    </div>
                    <div className="col">
                        <div className="panel panel-pink">address</div>
                    </div>
                    <div className="col">
                        <div className="panel panel-pink">public key (to prove authenticity)</div>
                    </div>
                </div>
                <br/>

                <div className="text-center">
                    { !this.state.schools
                        ? <div/>
                        : [
                            (this.state.error
                                    ? <p>error</p>
                                    : this.state.schools.data.map((school, key) => {
                                        return (
                                            <div key={school.id} className="row">
                                                <div className="col">
                                                    <img width="200" height="auto" className="photo" src={school.logo} alt="img"/>
                                                </div>
                                                <div className="col">
                                                    <div className="panel panel-pink">{school.name}</div>
                                                </div>
                                                <div className="col">
                                                    <div className="panel panel-pink">{school.address}</div>
                                                </div>
                                                <div className="col">
                                                    <div className="panel panel-pink"><a href="">download</a></div>
                                                </div>
                                        </div>
                                        )
                                    })
                            ),
                        ]
                    }

                    {this.state.loading && (<span className="spinner-border spinner-border-sm">Loading</span>)}

                    {this.state.message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {this.state.message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
