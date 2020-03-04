const validator = require('validator');

exports.signUpValidation = signUpObject => {
  try {
    for (let i = 0; i <= Object.keys(signUpObject).length; i++) {
      switch (Object.keys(signUpObject)[i]) {
        case 'firstName':
          if (validator.isEmpty(signUpObject[Object.keys(signUpObject)[i]])) {
            throw new Error('First Name can not be empty. Try Again!');
          }
          break;
        case 'lastName':
          if (validator.isEmpty(signUpObject[Object.keys(signUpObject)[i]])) {
            throw new Error('Last Name can not be empty. Try Again!');
          }
          break;
        case 'email':
          if (!validator.isEmail(signUpObject[Object.keys(signUpObject)[i]])) {
            throw new Error('Email is not valid. Try Again!');
          }
          break;
        case 'phone':
          if (!validator.isMobilePhone(signUpObject[Object.keys(signUpObject)[i]])) {
            throw new Error('Phone number is not valid. Try Again!');
          }
          break;
        case 'password':
          if (!signUpObject[Object.keys(signUpObject)[i]].match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
            throw new Error('The Password field must be at least 8 characters. It must contain at least one letter, one special character and one number.');
          }
          break;
        case 'confirmPassword':
          if (signUpObject['confirmPassword'] !== signUpObject['password']) {
            throw new Error('Password and Confirm Password does not match. Try Again!');
          }
          break;
        case 'state':
          if (validator.isEmpty(signUpObject[Object.keys(signUpObject)[i]])) {
            throw new Error('State can not be empty. Try Again!');
          }
          break;
        case 'agree':
          if (!signUpObject[Object.keys(signUpObject)[i]]) {
            throw new Error('You must check terms and conditions box for account Sign Up.');
          }
          break;
      }
    }
  } catch (e) {
    throw new Error(e);
  }
}