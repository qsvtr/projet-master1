import React, {Component} from "react";
import User from "../../services/user.service"

export default class SchoolList extends Component {
    /*const [schools, setSchools] = useState(null);
    const [error, setError] = useState(null)

    useEffect(() => {
        async function displaySchools() {
            const schools = await fetchSchools()
            console.log('schools', schools)
            setSchools(schools)
        }
        displaySchools()
    }, []);*/
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
                <h1>Schools list:</h1>
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
                                                    <img width="100" height="100" className="photo" src={school.logo} alt="img"/>
                                                </div>
                                                <div className="col">
                                                    <div className="panel panel-pink">{school.name}</div>
                                                </div>
                                                <div className="col">
                                                    <div className="panel panel-pink">{school.address}</div>
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
