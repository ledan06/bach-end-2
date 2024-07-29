//Gửi lời kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () =>{
            button.closest(".box-user").classList.add("add")
            const userId = button.getAttribute("btn-add-friend")
            
            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}
//Hết gửi lời kết bạn

//Hủy gửi lời kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () =>{
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend")
            
            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}
//Hết Hủy gửi lời kết bạn

//Từ chối lời kết bạn
const refuseFriend = (button) =>{
    button.addEventListener("click", () =>{
        button.closest(".box-user").classList.add("refuse")
        const userId = button.getAttribute("btn-refuse-friend")
        
        socket.emit("CLIENT_REFUSE_FRIEND", userId)
    })
}
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button)
    })
}
//End Từ chối lời kết bạn

//Chấp nhận lời kết bạn
const acceptFriend = (button) => {
    button.addEventListener("click", () =>{
        button.closest(".box-user").classList.add("accepted")
        const userId = button.getAttribute("btn-accept-friend")
        
        socket.emit("CLIENT_ACCEPT_FRIEND", userId)
    })
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if(listBtnAcceptFriend.length > 0){
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button)
    })
}
//End chấp nhận lời kết bạn


// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const bageUserAccept = document.querySelector("[bage-users-accept]")
if(bageUserAccept){
    const userId = bageUserAccept.getAttribute("bage-users-accept")
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",(data) =>{
        if(userId === data.userId){
            bageUserAccept.innerHTML = data.lengthAcceptFriend
        }
    })
    
}
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND


// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    //Trang lời mời đã nhận
    const dataUsersAccept = document.querySelector("[data-users-accept]")
    if(dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept")
        if(userId === data.userId){
            const div = document.createElement("div")
            div.classList.add("col-6")
            div.setAttribute("user-id", data.infoUserA._id)
            //Vẽ user ra giao diện
            div.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg" alt="${data.infoUserA.fullName}">
                </div>
                <div class="inner-info">
                    <div class="inner-name">
                        ${data.infoUserA.fullName}
                    </div>
                    <div class="inner-buttons">
                        <button 
                            class="btn btn-sm btn-primary mr-1"
                            btn-accept-friend="${data.infoUserA._id}"
                        >
                            Chấp nhận
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1"
                            btn-refuse-friend="${data.infoUserA._id}"
                            >
                            Xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1"
                            btn-deleted-friend="" 
                            disabled="disabled"
                        >
                            Đã xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-primary mr-1"
                            btn-accepted-friend="" 
                            disabled="disabled"
                        >
                            Đã chấp nhận
                        </button>
                    </div>
                </div>
            </div>
            `
            dataUsersAccept.appendChild(div)
    
            //Hết vẽ giao diện
    
            //Hủy lời mời kết bạn
            const buttonRefuse = div.querySelector("[btn-refuse-friend]")
            refuseFriend(buttonRefuse)
            //Hết hủy lời mời kết bạn
    
            //Chấp nhận lời mời kết bạn
            const buttonAccept = div.querySelector("[btn-accept-friend]")
            acceptFriend(buttonAccept)
            //End Chấp nhận lời mời kết bạn
    
        }
    }
    
    //Trang danh sách người dùng
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
    if(dataUsersNotFriend){
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend")
        if(userId === data.userId){
            const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id='${data.infoUserA._id}']`)
            if(boxUserRemove){
                dataUsersNotFriend.removeChild(boxUserRemove)
            }
        }
    }
    
})
const dataUsersAccept = document.querySelector("[data-users-accept]")

// SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND

    socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
        const boxUserRemove = document.querySelector(`[user-id='${data.userIdA}']`)
        if(boxUserRemove){
            const dataUsersAccept = document.querySelector("[data-users-accept]")
            const userIdB = bageUserAccept.getAttribute("bage-users-accept")
            if(userIdB === data.userIdB){
                dataUsersAccept.removeChild(boxUserRemove)
            }
        }
    })
//END SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USERS_STATUS
socket.on("SERVER_RETURN_USERS_STATUS", (data)=>{
const dataUsersFriend = document.querySelector("[data-users-friend]")
if(dataUsersFriend){
    const boxUser = dataUsersFriend.querySelector(`[user-id = "${data.userId}"]`)
    if(boxUser){
        const boxStatus = boxUser.querySelector("[status]")
        boxStatus.setAttribute("status", data.status)
    }
}
})

// END SERVER_RETURN_USERS_STATUS