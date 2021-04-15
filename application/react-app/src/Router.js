import React from 'react';
import { HashRouter as ReactRouter, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from "./components/Home";
import MintFunction from "./components/MintFunction"
import Information from "./components/Information";

const Router = () => {
    return (
        <ReactRouter>
            <Header />
            <Information/>
            <Switch>
                <Route exact path='/' render={() => (<Home/>)}/>
            </Switch>
            <Switch>
                <Route exact path='/mintFunction' render={() => (<MintFunction/>)}/>
            </Switch>
            <Footer />
        </ReactRouter>
    );
};

export default Router;
