const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
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
    try{
        const user = this;
        const token = jwt.sign({
            _id: user._id.toString()
        }, process.env.JWT_SECRET);
        user.tokens = user.tokens.concat({
            token
        });
        await user.save();
        return token;
    } catch(e) {
        throw new Error('Error occured while signing user token! Please try again');
    }
}

const User = mongoose.model('User', userSchema);


module.exports = User;