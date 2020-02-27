const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length === 0) {
                throw new Error('Entered first Name is not valid');
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length === 0) {
                throw new Error('Entered last Name is not valid');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Entered email is not valid');
            }
        }
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (value.toString().length < 10 || value.toString().length > 12) {
                throw new Error('Entered phone number is not valid');
            }
        }
    },
    state: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Your password should not contain common words');
            }
        }
    },
    resetPassword: {
        resetRequested: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            trim: true,
            default: '',
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}


const User = mongoose.model('User', userSchema);


module.exports = User;