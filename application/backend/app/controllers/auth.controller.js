const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const School = db.school;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({username: req.body.username, email: req.body.email, password: bcrypt.hashSync(req.body.password, 8)})
    .then(user => {
        res.send({ message: "User registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({where: {username: req.body.username}})
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({accessToken: null, message: "Invalid Password!"});
      }
      // 24 hours
      const token = jwt.sign({ id: user.id }, config.secret, {expiresIn: 86400});
        res.status(200).send({id: user.id, username: user.username, email: user.email, accessToken: token});
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.addSchool = (req, res) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({message: "No token provided!"});
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized!"});
        }
    });
    console.log(req.body)
    School.create({name: req.body.name, address: req.body.address, logo: req.body.logo, publicKey: req.body.publicKey})
        .then(user => {
            res.send({ message: "School created successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    // return res.status(200).send({message: "School created."})
}
