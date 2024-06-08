const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")

if(buttonsChangeStatus.length>0){
    const formChangeStatus = document.querySelector("#form-change-status")
    
    const path = formChangeStatus.getAttribute("data-path")

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click" , ()=>{
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;

            formChangeStatus.submit();
        })
    })

}

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete-item]");
if(buttonDelete.length > 0){
    const formDelete = document.querySelector("#form-delete-item")
    const path = formDelete.getAttribute("data-path")
    buttonDelete.forEach(button => {
        button.addEventListener("click", ()=>{
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")
            if(isConfirm){
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=DELETE`
                formDelete.action = action;
                formDelete.submit();
            }
            
        })
    })
}


