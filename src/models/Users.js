const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    notes: {
        type: Array,
        required: true
    }
});

const UserModel = mongoose.model("poem-assistant-collection", UserSchema)
module.exports = UserModel