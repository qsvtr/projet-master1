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
      .catch( err => res.status(500).send(-1))
}

exports.getSchool = (req, res) => {
  School.findOne({where: {address: req.body.address}})
      .then(user => {
        if (!user) {
          return res.status(200).send(false);
        } else {
          res.status(200).send(true)
        }})
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
}
