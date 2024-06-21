const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system")

const filterStatusHelpers = require("../../helpers/filterStatus")
const searchHelpers = require("../../helpers/search")
const paginationHelpers = require("../../helpers/pagination")

const createTreeHelper = require("../../helpers/createTree")

//[GET] /admin/products-category
module.exports.index = async(req, res) => {

    const filterStatus = filterStatusHelpers(req.query);
    const objectSearch = searchHelpers(req.query);

    let find={
        deleted: false
    }

    //Status
    if(req.query.status){
        find.status = req.query.status
    };

    //Search
    if(objectSearch.regex){
        find.title = objectSearch.regex
    };

    
   

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}

//[Patch] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
    const status = req.params.status
    const id = req.params.id;
    
    await ProductCategory.updateOne({ _id: id }, { status: status });
    //updateOne là hàm của mongoos để update 1 sản phẩm

    req.flash("success", "Cập nhật trạng thái thành công!")
    res.redirect("back");
}

//[PATCH] /admin/products-category/change-/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
 
    switch (type) {
     case "active":
         await ProductCategory.updateMany({ _id: { $in: ids} }, { status: "active"});
         req.flash("success", "Cập nhật trạng thái thành công!")
         break;
     case "inactive":
         await ProductCategory.updateMany({ _id: { $in: ids} }, { status: "inactive"}); 
         req.flash("success", "Cập nhật trạng thái thành công!")
         break;
    case "delete-all":
        await ProductCategory.updateMany({ _id: { $in: ids} }, {
            deleted: true,
            deletedAt: new Date()
        }); 
        req.flash("success", " Đã xóa thành công!")
        break;
    case "change-position":
        for (const item of ids) {
            
            let [id, position] = item.split("-")
            position = parseInt(position)
            await ProductCategory.updateOne({ _id: id }, {
                position: position 
            });
            req.flash("success", "Cập nhật vị trí thành công!")
            // req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm!`)
        }
        break;
     default:
         break;
    }
    res.redirect("back");
 }

//[DELETE] /admin/product-category/delete/id
module.exports.deleteItems = async (req, res) => {
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", "Đã xóa thành công!")
    res.redirect("back");
}
//[GET] /admin/products-category/create
module.exports.create = async(req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}

//[POST] /admin/products-category/create
module.exports.createPost = async(req,res) => {

    if(req.body.position == ""){
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1; 
    }
    else{
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}