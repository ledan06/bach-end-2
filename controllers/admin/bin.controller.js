const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system")
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
//[GET] /bins/index
module.exports.index = (req, res) => {
    res.render("admin/pages/bin/index",{
        pageTitle: "Thùng rác"
    })
}
//[GET] /bins/product-category
module.exports.binCategory = async (req, res) => {

    let find={
        deleted: true
    }

    const records = await ProductCategory.find(find)

    res.render("admin/pages/bin/binCategory", {
        pageTitle: "Danh mục sản phẩm đã bị xóa",
        records: records,
    });
}

//[PATCH] /bins/product-category/restore/:id
module.exports.restoreCategory = async (req, res)=> {
    const id = req.params.id

    await ProductCategory.updateOne({ _id: id}, {deleted: false})

    req.flash("success", "Khôi phục thành công!")
    res.redirect("back");
}

//[DELETE] /bins/product-category/delete/:id
module.exports.deleteCategory = async (req, res)=> {
    const id = req.params.id

    await ProductCategory.deleteOne({ _id: id})

    req.flash("success", "Đã xóa vĩnh viễn")
    res.redirect("back");
}

//[GET] /bins/product-category
module.exports.binProduct = async (req, res) => {

    let find={
        deleted: true
    }

    const records = await Product.find(find)
    for (const record of records) {
        const user = await Account.findOne({ _id: record.deletedBy.account_id})

        if(user){
            record.accountFullName = user.fullName
        }
    
    }
    res.render("admin/pages/bin/binProduct", {
        pageTitle: "Sản phẩm đã bị xóa",
        records: records,
    });
}

//[PATCH] /bins/product/restore/:id
module.exports.restoreProduct = async (req, res)=> {
    const id = req.params.id

    await Product.updateOne({ _id: id}, {deleted: false})

    req.flash("success", "Khôi phục thành công!")
    res.redirect("back");
}

//[DELETE] /bins/product/delete/:id
module.exports.deleteCategory = async (req, res)=> {
    const id = req.params.id

    await Product.deleteOne({ _id: id})

    req.flash("success", "Đã xóa vĩnh viễn")
    res.redirect("back");
}

//[PATCH] /admin/bins/product/change-/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
 
    switch (type) {
     case "restore":
         await Product.updateMany({ _id: { $in: ids} }, {
            deleted: false,
         });
         req.flash("success", "Khôi phục thành công!")
         break;
     case "delete-all":
         await Product.deleteMany({ _id: { $in: ids} }); 
         req.flash("success", "Đã xóa vĩnh viễn")
         break;
    default:
         break;
    }
    res.redirect("back");
 }