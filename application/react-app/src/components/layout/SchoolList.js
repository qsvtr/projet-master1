import React, { useEffect, useState} from "react";
import User from "../../services/user.service"

export default function SchoolList() {
    const [schools, setSchools] = useState(null);

    useEffect(() => {
        async function displaySchools() {
            const schools = await fetchSchools()
            console.log(schools)
            setSchools(schools)
        }
        displaySchools()
    }, []);

    const fetchSchools = async () => {
        return await User.getSchools()
    }
    return (
        <div className="content mr-auto ml-auto">
            <h1>Schools list:</h1>

            <div className="row text-center">
                { !schools
                    ? <p>loading</p>
                    : [
                        (schools.data === -1
                                ? <p>can't fetch data :/</p>
                                : schools.data.map((school, key) => {
                                    return (
                                        <div key={school.id} className="col-md-3 mb-3">
                                            <p>{school.id}</p>
                                            <p>{school.name}</p>
                                            <p>{school.address}</p>
                                            <img width="100" height="100" className="photo" src={school.logo} alt="img"/>
                                        </div>
                                    )
                                })
                        ),
                    ]
                }
            </div>
        </div>
    )
}
