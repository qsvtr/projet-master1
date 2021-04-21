import React from 'react';
import { HashRouter as ReactRouter, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from "./components/Home";
import MintNFT from "./components/MintNFT"
import Information from "./components/layout/Information";
import Login from "./components/admin/Login";
import Profile from "./components/admin/Profile";
import AdminPage from "./components/admin/Admin";

const Router = () => {
    return (
        <ReactRouter>
            <Header />
            <Information/>
            <Switch>
                <Route exact path={["/", "/home"]} component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profile" component={Profile} />
                <Route path="/admin" component={AdminPage} />
                <Route exact path='/mintNFT' render={() => (<MintNFT/>)}/>
            </Switch>
            <Footer />
        </ReactRouter>
    );
};

export default Router;
