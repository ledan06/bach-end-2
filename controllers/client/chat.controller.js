const Chat = require("../../models/chat.models")
const User = require("../../models/user.model")
const chatSocjet = require("../../socket/clients/chat.socket")
//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId
    //SocketIo
    chatSocjet(req, res)
    //End SocketIo
    //Lấy data từ database
      const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
      })
      for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName")
        chat.infoUser = infoUser
      }
    //End Lấy data từ database
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    })
}