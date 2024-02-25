const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const msgSchema = new Schema(
    {
        message:{
            text: {
                type: String,
                required: true,
            },
            users: Array,
            sender: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "User",
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("messages", msgSchema);