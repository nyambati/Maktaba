(function() {  'use strict';  var User = require('../models/user'),    Doc = require('../models/document'),    bcrypt = require('bcrypt-nodejs');  module.exports = {    // create user    createUser: function(req, res) {      if (req.body === undefined) {        res.json({          message: 'please provide  user data'        });      }      // Hash the password before we store it into the database      var hash = bcrypt.hashSync(req.body.password);      User.create({        username: req.body.username,        name: {          first: req.body.firstname,          last: req.body.lastname        },        role: req.body.role,        email: req.body.email,        password: hash      }, function(err, users) {        if (err) {          res.send(err);        }        if (!users) {          res.status(400).send('User not created');        } else {          res.json(users);        }      });    },    // login in the user    loginUser: function(req, res) {      if (req.body.username === undefined && req.body.password === undefined) {        res.status(500).send({          message: 'No credentials provided'        });      } else {        User.findOne({          username: req.body.username        }, function(err, user) {          if (err) {            throw err;          }          if (!user) {            res.status(500).send({              message: 'Invalid username'            });          } else if (!bcrypt.compareSync(req.body.password, user.password)) {            res.status(500).send({              message: 'Invalid password'            });          } else {            req.session.username = user.username;            console.log(req.session.username);            res.json({              message: 'Login succesful'            });          }        });      }    },    // get all user    getAllUsers: function(req, res) {      User.find({}, function(err, users) {        if (err) {          res.send(err);        }        res.json(users);      });    },    // get one user form the db    getUser: function(req, res) {      User.findOne({        _id: req.params.id      }, function(err, users) {        if (err) {          res.status(404).send({            error: 'User not found'          });        }        res.json(users);      });    },    // get documents by id    getDocumentByUserId: function(req, res) {      Doc.find({        ownerId: req.params.id      }, function(err, docs) {        if (err) {          res.status(404).send({            error: 'Document not found'          });        } else {          res.send(docs);        }      });    },    // update user    updateUser: function(req, res) {      User.update({        _id: req.params.id      }, {        $set: {          username: req.body.username,          name: {            first: req.body.firstname,            last: req.body.lastname          },          email: req.body.email,          password: req.body.password        }      }, function(err) {        if (err)          res.status(500).send({            error: 'Update failed'          });        else          res.status(200).send({            message: 'Update succesful'          });      });    },    // delete user from user    deleteUser: function(req, res) {      User.remove({        _id: req.params.id      }, function(err, ok) {        if (err) {          res.statu(500).send({            error: 'Delete failed'          });        }        res.status(200).send(ok);      });    },    // log out    logoutUser: function(req, res) {      req.session.destroy(function(err) {        if (!err) {          req.session = null;          var message = {};          message.success = true;          res.json(message);        }      });    }  };})();