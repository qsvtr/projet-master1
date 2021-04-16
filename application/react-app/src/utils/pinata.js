const axios = require("axios");

const pinPictureToIPFS = async (logo) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', logo);
    return axios.post(url, data, {
        maxContentLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            'pinata_api_key': "027a3a5204bf3ff59ffc",
            'pinata_secret_api_key': "b8c59aef2458bb2f4015b6f2624e32fb9eab4c1635d5c1fcd2336b32646453f3"
        }
    })
        .then(res => res.data.IpfsHash)
        .catch(err => console.log('error1'));
};

const pinJSONToIPFS = async (obj) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const res = await axios.post(url, obj, {
        headers: {
            pinata_api_key: "027a3a5204bf3ff59ffc",
            pinata_secret_api_key: "b8c59aef2458bb2f4015b6f2624e32fb9eab4c1635d5c1fcd2336b32646453f3",
        },
    });
    return res.data.IpfsHash
}

module.exports = {
    addDataToIPFS: (imagePath, metadata) => {
        return pinJSONToIPFS(metadata)
            .then(hash => "https://gateway.pinata.cloud/ipfs/"+hash)
            .catch(err => console.log(err))
    },
    pinPictureToIPFS: (logo) => {
        return pinPictureToIPFS(logo)
            .then(hash => "https://gateway.pinata.cloud/ipfs/"+hash)
            .catch(err => console.log(err))
    }
}
