import mongoose from 'mongoose'

// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },

}, { timestamps: true });

//Export the model
const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;