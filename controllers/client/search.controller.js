const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products")

//[GET] /search
module.exports.index = async (req, res) => {
   
    const keyword = req.query.keyword

    let newProducts = []; //let vs const
    if(keyword){
        const redex = new RegExp(keyword, "i")
        const products = await Product.find({
            title: redex,
            deleted: false,
            status: "active"
        })
        newProducts = productsHelper.newPrice(products)
    }

    res.render("client/pages/search/index",{
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    
    })
}