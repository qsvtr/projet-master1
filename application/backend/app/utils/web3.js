const Web3 = require('web3');

const config = require("../config/auth.config")
const web3Provider = new Web3.providers.HttpProvider(`${config.api_node}/ext/bc/C/rpc`);
const web3 = new Web3(web3Provider);
const Diplome = require('./Diplome.json')
const contract = new web3.eth.Contract(Diplome.abi, config.contract_address)

exports.getLastBlock = async () => {
    return await web3.eth.getBlockNumber()
}

exports.getTokenUri = async (i) => {
    return await contract.methods.tokenURI(i).call()
}
