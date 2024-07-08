const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products")
const ProductCategory = require("../../models/product-category.model");

const productsCategoryHelper = require("../../helpers/product-category")

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});

    const newProducts = productsHelper.newPrice(products)

    res.render("client/pages/products/index",{
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}
//[GET] /products/:slug
module.exports.detail = async (req, res) => {   
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };
    
        const product = await Product.findOne(find);

        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })
            product.category = category
        }

        product.priceNew = productsHelper.priceNewProduct(product)

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {      
        res.redirect(`/products`)
    }
}

//[GET] /products//:slugCategory
module.exports.category = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({
            deleted: false,
            status: "active",
            slug: req.params.slugCategory
        })
    
        const lisSubCategory = await productsCategoryHelper.getSubCategory(category.id)

        const lisSubCategoryId = lisSubCategory.map(item => item.id)

        const products = await Product.find({
            deleted: false,
            status: "active",
            product_category_id: { $in: [category.id, ...lisSubCategoryId]}
        }).sort({ position: "desc" })

        const newProducts = productsHelper.newPrice(products)
    
        res.render("client/pages/products/index",{
            pageTitle: category.title,
            products: newProducts
        });
    } catch (error) {
        res.redirect(`/products`)
    }
    
}