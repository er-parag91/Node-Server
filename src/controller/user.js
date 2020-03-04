const User = require('../models/user');
const validator = require('./validator');

const {
  sendWelcomeEmail,
  sendCancelEmail,
  sendResetPasswordEmail
} = require('../emails/account');
const passwordGenerator = require('generate-password');
const bcrypt = require('bcryptjs');
// Cropping image tool
const sharp = require('sharp');
// file upload package
const multer = require('multer');


exports.signup = (req, res, next) => {
  try {
    // validates user sign up data before proceeding
    validator.signUpValidation(req.body);
    const user = new User(req.body);
    return bcrypt.hash(user.password, 8)
      .then(hashedPassword => {
        user.password = hashedPassword;
        return user.save();
      })
      .then(result => {
        return user.generateAuthToken()
      })
      .then(token => {
        // sendWelcomeEmail(user.email, user.firstName);
        return res.status(201).send({
          user,
          token
        });
      })
      .catch(err => {
        if (err.code === 11000) {
          console.log(err)
          return res.status(422).send(err.errmsg);
        }
        return res.status(400).send('Something went wrong on our server! Please try again!');
      })
  } catch (e) {
    return res.status(400).send(e.message || 'Something went wrong on our server! Please try again!');
  }
};

exports.getUser = async (req, res, next) => {
  return res.send(req.user);
}

exports.userLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;
  try {
    User.findOne({
        email
      })
      .then(foundUser => {
        if (!foundUser) {
          return res.status(400).send('Invalid Credentials. Please try again!');
        }
        user = foundUser;
        return bcrypt.compare(password, user.password)
      })
      .then(isMatch => {
        if (!isMatch) {
          console.log(isMatch);
          return res.status(400).send('Invalid Credentials. Please try again!');
        }
        return user.generateAuthToken();
      })
      .then(token => {
        return res.status(200).send({
          user,
          token
        });
      })
      .catch((e) => {
        res.status(400).send(e.message ? e.message : 'Invalid Credentials. Please try again!');
      })
  } catch (e) {
    res.status(400).send('Something went wrong! Please try again');
  }
}

exports.userForgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });
    const newPassword = passwordGenerator.generate({
      length: 15,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true
    });
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.resetPassword = {
      resetRequested: true,
      password: hashedPassword
    }
    await user.save();
    sendResetPasswordEmail(user.email, newPassword);
    res.send();
  } catch (e) {
    console.log(e);
    res.status(400).send('Error while sending reset request. Please try again later!');
  }
}

exports.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
}

exports.userLogoutAll = async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
}

exports.updateUser = async (req, res) => {

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];

  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Not valid updates'
    });
  }
  try {
    const user = req.user;

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
}

exports.deleteUser = async (req, res) => {
  console.log(req.user);
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.firstName);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
}

exports.userUpdatePicture = async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({
    width: 250,
    height: 250
  }).png().toBuffer()
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({
    error: error.message
  });
}

exports.getUserPicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
}

exports.deleteUserPicture = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
};


exports.pictureUpload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload jpg or jpeg or png file only'));
    }
    cb(undefined, true);
  }
});