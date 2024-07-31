const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
    {
        title: String,
        avartar: String,
        typeRoom: String,
        status: String,
        users: [
            {
                user_id: String,
                role: String
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deleteAt: Date
    },
    {
    timestamps: true
});

const RoomChat = mongoose.model('Roomchat', roomChatSchema, "rooms-chat");

module.exports = RoomChat;