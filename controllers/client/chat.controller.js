const Chat = require("../../models/chat.models")
const User = require("../../models/user.model")
const chatSocjet = require("../../socket/clients/chat.socket")
//[GET] /chat
module.exports.index = async (req, res) => {
    //SocketIo
    chatSocjet(res)
    //End SocketIo
    //Lấy data từ database
      const chats = await Chat.find({
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