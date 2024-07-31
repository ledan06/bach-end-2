const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")
module.exports = (res) => {
    _io.once('connection', (socket) => {
        // Gửi lời kết bạn
        socket.on("CLIENT_ADD_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id
            //Thêm id của Người gửi vào acceptFriends của người nhận
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if(!existIdAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {acceptFriends: myUserId}
                }
            )
            }
            //Thêm id của Người Nhận  vào requestFriends của người gửi
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if(!existIdBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {requestFriends: userId}
                }
            )
            }
            // Lấy ra độ dài acceptFriends của người nhận(B) và trả về cho người nhận(B)
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriend = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriend: lengthAcceptFriend
            })

            //Lấy info của Người gửi(A) trả về cho Người nhận(B)
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id fullName avatar")

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                infoUserA: infoUserA,
                userId: userId,
            })
       })

       //Hủy gửi lời kết bạn
       socket.on("CLIENT_CANCEL_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id
            //Xóa id của Người gửi vào acceptFriends của người nhận
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if(existIdAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {acceptFriends: myUserId}
                }
            )
            }
            //Xóa id của Người Nhận  vào requestFriends của người gửi
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if(existIdBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {requestFriends: userId}
                }
            )}
            // Lấy ra độ dài acceptFriends của người nhận(B) và trả về cho người nhận(B)
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriend = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriend: lengthAcceptFriend
            })
            //Lấy id của A trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{
                userIdB: userId,
                userIdA: myUserId
            })
        })
        

        //Từ chối kết bạn
       socket.on("CLIENT_REFUSE_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id
            //Xóa id của Người gửi vào acceptFriends của người nhận
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {acceptFriends: userId}
                }
            )
            }
            //Xóa id của Người Nhận  vào requestFriends của người gửi
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if(existIdBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {requestFriends: myUserId}
                }
            )}
        })

        //Chấp nhận kết bạn
       socket.on("CLIENT_ACCEPT_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id
            

            //Check exist
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            //End Check exist

            //Tạo phòng chat chung
            let roomChat
            if(existIdAinB && existIdBinA){
                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: userId,
                            role: "superAdmin"
                        }
                    ]
                }
                roomChat = new RoomChat(dataRoom)
                await roomChat.save()
            }

            //Thêm {user_id, room_chat_id} của người gửi vào friendsList của người nhận

            //Xóa id của Người gửi trong acceptFriends của người nhận
            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    } ,
                    $pull: {acceptFriends: userId}
                }
            )
            }
            //Xóa id của Người Nhận  vào requestFriends của người gửi
            if(existIdBinA){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id
                        }
                    } ,
                    $pull: {requestFriends: myUserId}
                }
            )}
        })
    })
}