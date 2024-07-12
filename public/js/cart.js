//Cập nhật số lượng sản phẩm
const inputsQuantity = document.querySelectorAll("input[name='quantity']")
if(inputsQuantity.length>0){
    for (const input of inputsQuantity) {
        input.addEventListener("change", (e) =>{
            const productId = input.getAttribute("product-id")
            const quantity = e.target.value

            window.location.href = `/cart/update/${productId}/${quantity}`
        })
    }
}
//Hết Cập nhật số lượng sản phẩm
