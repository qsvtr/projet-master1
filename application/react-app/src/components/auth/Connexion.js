import React from 'react';

function Connexion() {

    const credentials = {
        login:'', password: ''
    };

    const mySubmitHandler = (event) => {
        event.preventDefault();
    };

    const myChangeHandler = (event) => {
        credentials[event.target.name] = event.target.value;
    };

    return(
        <div className="container" >
            <h1 className="text-center" >Enter your credentials</h1>
            <form onSubmit={mySubmitHandler}>
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Login'
                    name='login'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Password'
                    name='password'
                    onChange={myChangeHandler}
                />
                <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Connect'
                />
            </form>
        </div>
    );
}

export default Connexion;