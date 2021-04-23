import './SchoolList.css'
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

    renderTableHeader() {
        let header = Object.keys(this.state.school.data[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.schools.data.map((school, index) => {
            const { id, name, address, logo } = school
            return (
                <tr key={id}>
                    <td><img width="200" height="auto" className="photo" src={logo} alt="img"/></td>
                    <td>{name}</td>
                    <td>{address}</td>
                </tr>
            )
        })
    }


    render() {
        return (
            <div className="content mr-auto ml-auto">
                <div className="text-center">
                    { !this.state.schools
                        ? <div/>
                        : [
                            (this.state.error
                                    ? <p>error</p>
                                    :   <table id='students'>
                                            <tbody>
                                                <tr><th>logo</th><th>name</th><th>address</th></tr>
                                                {this.renderTableData()}
                                            </tbody>
                                        </table>
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
