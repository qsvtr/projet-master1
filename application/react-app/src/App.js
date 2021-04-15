//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from './Router'
import React, {useEffect, useState} from 'react'
import GlobalState from './contexts/GlobalState';


function App() {
    const [state, setState] = useState({});
    useEffect(() => {
        setState(state => ({...state, connected: false}))
    }, []);
    return (
        <GlobalState.Provider value={[state, setState]}>
            <div className='main2'>
                <Router />
            </div>
        </GlobalState.Provider>
    );
}

export default App;
