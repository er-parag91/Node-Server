const User = require('../models/user');

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

exports.signup = async (req, res, next) => {
  const user = new User(req.body);
  try {
    user.password = await bcrypt.hash(user.password, 16);
    await user.save();
    sendWelcomeEmail(user.email, user.firstName);
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

exports.getUser = async (req, res, next) => {
  return res.send(req.user);
}

exports.userLogin = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    setTimeout(() => {
      res.send({
        user,
        token
      });
    }, 3000)
  } catch (e) {
    res.status(400).send('Invalid Credentials. Please try again!');
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