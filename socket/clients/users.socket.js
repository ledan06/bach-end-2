const User = require("../../models/user.model")
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
            

            //Thêm {user_id, room_chat_id} của người gửi vào friendsList của người nhận

            //Xóa id của Người gửi trong acceptFriends của người nhận
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if(existIdAinB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    } ,
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
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    } ,
                    $pull: {requestFriends: myUserId}
                }
            )}
        })
    })
}