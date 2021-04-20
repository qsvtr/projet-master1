const crypto = require("crypto")
const cryptoUtils = require("../utils/crypto")
const db = require("../models");
const School = db.school;

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
          console.log(err)
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

exports.decryptData = (req, res) => {}
