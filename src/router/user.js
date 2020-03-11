const express = require('express');
const router  = new express.Router();

// controller
const userController = require('../controller/user');

// Auth middleware
const auth = require('../middleware/auth');


// -------------------------- User routes -----------------------//

// Create/Sign up user - post request
router.post('/users', userController.signup);

// Read users - Get request
router.get('/users/me', auth, userController.getUser);

// log in the user based on comparison method
router.post('/users/login', userController.userLogin)

// Forgot password post request
router.post('/users/forgotPassword', userController.userForgotPassword);

// Log Out the user based on req.token supplied
router.post('/users/logout', auth, userController.logoutUser)

// Log out of all devices or clear the tokens object on the user
router.post('/users/logoutAll', auth, userController.userLogoutAll)


// Find user by id and update - patch request
router.patch('/users/me', auth, userController.updateUser) 

// Find user by id and delete - delete request
router.delete('/users/me', auth, userController.deleteUser);

// upload profile picture
router.post('/users/me/avatar', auth, userController.pictureUpload.single('avatar'), userController.userUpdatePicture);

// router get profile picture
router.get('/users/:id/avatar', userController.getUserPicture);

// delete the profile picture
router.delete('/users/me/avatar', auth, userController.deleteUserPicture);

// Get the user cart
router.get('/users/me/myCart', auth, userController.getMyCart);

//Delete cart item
router.delete('/users/me/myCart/delete/:cartItemId', auth, userController.deleteCartItem);

module.exports = router;