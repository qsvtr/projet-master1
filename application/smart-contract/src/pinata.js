const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require('dotenv').config({path: '.env'})

const pinataApiKey = process.env.pinataApiKey
const pinataSecretApiKey = process.env.pinataSecretApiKey

const pinPictureToIPFS = async (picPath) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', fs.createReadStream(picPath));
    return axios.post(url, data, {
        maxContentLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey
            }
        })
        .then(res => res.data)
        .catch(err => console.log('error1'));
};

const pinJSONToIPFS = async (obj) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const res = await axios.post(url, obj, {
        headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        },
    });
    return res.data.IpfsHash
}

module.exports = {
    addDataToIPFS: (imagePath, metadata) => {
        return pinPictureToIPFS(imagePath)
            .then(data => {
                metadata.image = "https://gateway.pinata.cloud/ipfs/"+data.IpfsHash
                return pinJSONToIPFS(metadata)
                    .then(hash => "https://gateway.pinata.cloud/ipfs/"+hash)
                    .catch(err => console.log(err))
            })
            .catch(err => console.log('error2'))
    }
}
