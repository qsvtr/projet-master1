import React from 'react';
import { HashRouter as ReactRouter, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from "./components/Home";
import MintNFT from "./components/MintNFT"
import Information from "./components/layout/Information";
import Connexion from "./components/auth/Connexion";
import DisplayNFTs from "./components/DisplayNFTs";

const Router = () => {
    return (
        <ReactRouter>
            <Header />
            <Information/>
            <Switch>
                <Route exact path='/' render={() => (<Home/>)}/>
            </Switch>
            <Switch>
                <Route exact path='/nft' render={() => (<DisplayNFTs/>)}/>
            </Switch>
            <Switch>
                <Route exact path='/mintNFT' render={() => (<MintNFT/>)}/>
            </Switch>
            <Switch>
                <Route exact path='/Connexion' render={() => (<Connexion/>)}/>
            </Switch>
            <Footer />
        </ReactRouter>
    );
};

export default Router;
