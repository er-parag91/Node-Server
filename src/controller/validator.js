const validator = require('validator');
const Filter = require('bad-words');

const filter = new Filter();

exports.signUpValidation = signUpObject => {
  try {
    for (let i = 0; i < Object.keys(signUpObject).length; i++) {
      const key = Object.keys(signUpObject)[i];
      switch (key) {
        case 'firstName':
          if (validator.isEmpty(signUpObject[key])) {
            throw new Error('First Name can not be empty. Try Again!');
          }
          break;
        case 'lastName':
          if (validator.isEmpty(signUpObject[key])) {
            throw new Error('Last Name can not be empty. Try Again!');
          }
          break;
        case 'email':
          if (!validator.isEmail(signUpObject[key])) {
            throw new Error('Email is not valid. Try Again!');
          }
          break;
        case 'phone':
          if (!validator.isMobilePhone(signUpObject[key])) {
            throw new Error('Phone number is not valid. Try Again!');
          }
          break;
        case 'password':
          if (!signUpObject[key].match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
            throw new Error('The Password field must be at least 8 characters. It must contain at least one letter, one special character and one number.');
          }
          break;
        case 'confirmPassword':
          if (signUpObject['confirmPassword'] !== signUpObject['password']) {
            throw new Error('Password and Confirm Password does not match. Try Again!');
          }
          break;
        case 'state':
          if (validator.isEmpty(signUpObject[key])) {
            throw new Error('State can not be empty. Try Again!');
          }
          break;
        case 'agree':
          if (!signUpObject[key]) {
            throw new Error('You must check terms and conditions box for account Sign Up.');
          }
          break;
      }
    }
  } catch (e) {
    throw new Error(e);
  }
}

exports.productValidation = productData => {
  try {
    for (let i = 0; i < Object.keys(productData).length; i++) {
      const key = Object.keys(productData)[i];
      switch (key) {
        case 'productName':
          if (validator.isEmpty(productData[key])) {
            throw new Error('Product Name can not be empty');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Name contains Profane Words');
          }
          break;
        case 'productDescription':
          if (validator.isEmpty(productData[key])) {
            throw new Error('Product Description can not be empty');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Description contains Profane Words');
          }
          break;
        case 'productSizes':
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Sizes contains Profane Words');
          }
          if (productData[key] && !productData[key].match(/^[^,][\sa-zA-Z0-9,]*[a-zA-Z0-9]$/)) {
            throw new Error('Product Sizes con not start or end with special characters.');
          }
          break;
        case 'productColors':
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Colors contains Profane Words');
          }
          if (productData[key] && !productData[key].match(/^[^,][\sa-zA-Z,]*[a-zA-Z]$/)) {
            throw new Error('Product Colors con not contain numbers and start or end with special characters.');
          }
          break;
        case 'productPrice':
          if (!String(productData[key]).match(/^\d*\.{1}\d{2}/)) {
            throw new Error('Product Price is not valid amount. Only Digits and two decimal point are must and allowed.');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Price contains Profane Words');
          }
          break;
        case 'productDiscountedPrice':
          if (productData[key] && !String(productData[key]).match(/^\d*\.{1}\d{2}/)) {
            throw new Error('Product Discounted Price is not valid amount. Only Digits and two decimal point are must and allowed.');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Discounted Price contains Profane Words');
          }
          break;
        case 'productCategory':
          if (!validator.isIn(productData[key], ['Featured', 'Men', 'Women', 'Boys', 'Girls', 'Baby', 'Personal Care', 'Accessories', 'Electronics', 'Food'])) {
            throw new Error('Selected Product Category is not valid');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Discounted Price contains Profane Words');
          }
          break;
        case 'productStock':
          if (!validator.isIn(productData[key], ['Yes', 'No'])) {
            throw new Error('Product Stock value must be either \'Yes\' or \'No\'');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Stock contains Profane Words');
          }
          break;
        case 'productWarnings':
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Warnings contains Profane Words');
          }
          break;
        case 'productBuyingFrequency':
          if (!validator.isIn(productData[key], ['Yes', 'No'])) {
            throw new Error('Product Buying Frequency value must be either \'Yes\' or \'No\'');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Buying Frequency contains Profane Words');
          }
          break;
        case 'productImage':
          if (!validator.isURL(productData[key])) {
            throw new Error('Product Image URL does not look right. Please try again or Contact Admin');
          }
          if (filter.isProfane(productData[key])) {
            throw new Error('Product Image contains Profane Words');
          }
          break;
        case 'adminApproved':
          throw new Error('You are not allowed to change product approval status.')
      }
    }
  } catch (e) {
    throw new Error(e);
  }
}