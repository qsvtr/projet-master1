const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require('dotenv').config({path: '.env'})

const pinataApiKey = "027a3a5204bf3ff59ffc"
const pinataSecretApiKey = "b8c59aef2458bb2f4015b6f2624e32fb9eab4c1635d5c1fcd2336b32646453f3"

const pinPictureToIPFS = async (picPath) => {
    console.log("picPath : ", picPath);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    console.log("DATA 1 : ", data);
    data.append('file', fs.createReadStream(picPath));
    console.log("DATA 2 : ", data);
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
        return pinJSONToIPFS(metadata)
            .then(hash => "https://gateway.pinata.cloud/ipfs/"+hash)
            .catch(err => console.log(err))
    }
}
