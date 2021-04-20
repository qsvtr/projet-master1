const crypto = require("crypto")
const cryptoUtils = require("../utils/crypto")
const db = require("../models");
const School = db.school;
const web3 = require("../utils/web3")
const axios = require("axios")

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Control Panel");
};

exports.getSchools = (req, res) => {
  School.findAll()
      .then( data => res.status(200).send(data))
      .catch( err => {
          res.status(500).send(null)
      })
}

exports.canIMint = (req, res) => {
  School.findOne({where: {address: req.body.address}})
      .then(school => {
        if (!school) {
          return res.status(200).send(false);
        } else {
          res.status(200).send(true)
        }})
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
}

exports.getSchool = (req, res) => {
    School.findOne({where: {address: req.body.address}})
        .then(school => {
            if (school) {
                return res.status(200).send(school);
            } else {
                res.status(200).send(null)
            }})
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.encryptMetadata = (req, res) => {
    const data = req.body.metadata
    console.log(data)
    if (!data) {
        res.status(500).send("data not found")
    }
    try {
        const IV = (crypto.randomBytes(8)).toString('hex')
        data.attributes.firstname = cryptoUtils.encrypt(data.attributes.firstname, IV)
        data.attributes.lastname = cryptoUtils.encrypt(data.attributes.lastname, IV)
        data.attributes.birthdate = cryptoUtils.encrypt(data.attributes.birthdate, IV)
        res.status(200).send({metadata: data, IV: IV})
    } catch(error) {
        res.status(500).send("cannot encrypt data ")
    }
}

const verifyAuthenticityNFT = async (schoolName, signature) => {
    const school = await School.findOne({where: {name: schoolName}})
    return await cryptoUtils.verify(school.publicKey, signature)
}

exports.getNFT = async (req, res) => {
    const data = req.body
    if (!data.id || !data.key) {
        res.status(500).send({message: "cannot find token"})
    }
    const tokenUriUrl = await web3.getTokenUri(data.id)
    const metadata = await axios.get(tokenUriUrl)
        .then(res => res.data)
        .catch(err => null)
    try {
        const IV = data.key
        metadata.attributes.firstname = cryptoUtils.decrypt(metadata.attributes.firstname, IV)
        metadata.attributes.lastname = cryptoUtils.decrypt(metadata.attributes.lastname, IV)
        metadata.attributes.birthdate = cryptoUtils.decrypt(metadata.attributes.birthdate, IV)
    } catch(error) {
        console.log(error)
        res.status(500).send({message: "cannot decrypt metadata"})
    }
    if (!metadata) {
        res.status(500).send({message: "cannot decrypt metadata"})
    } else {
        const verify = await verifyAuthenticityNFT(metadata.name, metadata.attributes.signature)
        if (!verify) {
            res.status(500).send({message: "not authentic"})
        } else {
            res.status(200).send({message: "success", data: metadata})
        }
    }

}
