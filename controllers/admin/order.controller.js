const Order = require("../../models/order.model")
const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")


//[GET] admin/order/
module.exports.index = async (req, res) => {
    const oders = await Order.find({
        deleted: false
    })
    for (const order of oders) {
        for (const product of order.product) {
            product.priceTotal = (product.price * product.discountPercentage /100)* product.quantity
        }
        order.totalPrice = order.product.reduce((sum,item)=>sum+item.priceTotal, 0)

        const cartId = order.cart_id
        const cartInfo = await Cart.findOne({
            _id: cartId
        })

        if(cartInfo.user_id){
            order.accound = 1
        }
        else{
            order.accound = 0
        }
    }

    res.render("admin/pages/order/index",{
        pageTitle: "Đơn hàng",
        orders: oders
    })
}

//[GET] admin/detail/:orderId
module.exports.detail = async (req, res) => {
    const orderId = req.params.orderId
    const orderInfo = await Order.findOne({
        _id: orderId
    })
    for (const product of orderInfo.product) {
        const productId = product.product_id
        const productInfo = await Product.findOne({
            _id: productId
        })
        productInfo.priceNew = productsHelper.priceNewProduct(productInfo)
        product.productInfo = productInfo
        product.totalPrice = productInfo.priceNew * product.quantity
    }
    orderInfo.totalPrice = orderInfo.product.reduce((sum,item)=>sum+item.totalPrice, 0)
    res.render("admin/pages/order/detail",{
        pageTitle: "Chi tiết đơn hàng",
        orderInfo: orderInfo
    })
}

//[PATCH] /change-status/:status/:orderId
module.exports.changeStatusPatch = async (req, res) => {
    const orderId = req.params.orderId
    const status = req.params.status
    const order = await Order.findOne({
        _id: orderId
    })

    await Order.updateOne({_id: orderId}, {status: status})
    req.flash("success", "Cập nhật trạng thái thành công!")
    res.redirect("back");
}