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
