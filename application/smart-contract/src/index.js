const Web3 = require('web3');
const fs = require('fs')
const axios = require('axios')
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config({path: '.env'})
const pinata = require('./pinata')

const mnemonic = process.env.mnemonic
const nodeAPI = process.env.nodeAPI

const provider = new HDWalletProvider(mnemonic, `${nodeAPI}/ext/bc/C/rpc`)
const web3 = new Web3(provider);

const mintNFT = async (contract, imagePath, data, addressTo, account) => {
    const metadata = await pinata.addDataToIPFS(imagePath, data)
    if (!metadata) return -1
    return await contract.methods.mint(addressTo, metadata).send({ from: account})
}

const displayNFTs = async (contract) => {
    console.log('\nNFTs:')
    const totalSupply = await contract.methods.totalSupply().call()
    console.log("totalSupply:", totalSupply)
    for (let i = 1; i <= totalSupply; i++) {
        let ipfs_link = await contract.methods.tokenURI(i).call()
        console.log(ipfs_link)
        await axios.get(ipfs_link)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }
}


const main = async () => {
    const contractName = process.env.contractName
    const contractAddress = process.env.contractAddress
    const account =  web3.eth.accounts._provider.getAddress()
    console.log('current account:', account)

    const Diplome = JSON.parse(await fs.readFileSync(`./truffle/build/contracts/${contractName}.json`, {encoding:'utf8'}))
    const contract = new web3.eth.Contract(Diplome.abi, contractAddress)
    // console.log(await contract.methods.symbol().call())

    /* mint NFT */
    const imagePath = "./src/images/cat.jpg"
    const data = {name:"NAME", description: "DESCRIPTION", image: "", attributes: {firstname: "FIRSTNAME", lastname: "LASTNAME", year: "YEAR"}}
    const addressTo = "0xeb29d3637369CB3eA8e0f9824e84e3fE8c1773e3"
    const token_created = await mintNFT(contract, imagePath, data, addressTo, account)
    console.log('tx mint:', token_created.transactionHash);

    await displayNFTs(contract)

    process.exit(0)
}

main()
