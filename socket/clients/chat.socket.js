const Chat = require("../../models/chat.models")
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
module.exports = (res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    //khi dùng _io.on thì lúc load lại trang nó luôn tạo ra bản ghi mới nên thay thế bằng _io.on

    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE",async (data)=>{
         let images = []

         for (const imageBuffer of data.images) {
           const link = await uploadToCloudinary(imageBuffer)
           images.push(link)
         }
         //Lưu vào database
         const chat = new Chat({
             user_id: userId,
             content: data.content,
             images: images
         })
         await chat.save()
         //Trả data về client
         _io.emit("SERVER_RETURN_MESSAGE", {
             userId: userId,
             fullName: fullName,
             content: data.content,
             images: images
         })
        })
        // Typing
        socket.on("CLIENT_SEND_TYPING",async (type)=>{
           socket.broadcast.emit("SERVER_RETURN_TYPING", {
             userId: userId,
             fullName: fullName,
             type: type
           })
        })   
        // End Typing
       });
}