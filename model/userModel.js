const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        min:3,
        max:20,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
        min:8,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: ""
    },
    notifications: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("chat-app-users", userSchema);