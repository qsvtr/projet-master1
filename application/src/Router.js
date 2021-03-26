import React from 'react';
import { HashRouter as ReactRouter, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from "./components/Home";
import AnotherPage from "./components/AnotherPage";

const Router = () => {
    return (
        <ReactRouter>
            <Header />
            <Switch>
                <Route exact path='/' render={() => (<Home/>)}/>
                <Route exact path='/another-page' render={() => <AnotherPage />} />
            </Switch>
            <Footer />
        </ReactRouter>
    );
};

export default Router;
