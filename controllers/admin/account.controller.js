const md5 = require("md5")
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token")
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }
    res.render("admin/pages/account/index", {
        pageTitle: "Danh sách toàn khoản",
        records: records
    })
}

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const roles = await Role.find(find)

    res.render("admin/pages/account/create", {
        pageTitle: "Tạo toàn khoản",
        roles: roles
    })
}

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    //md5 để mã hóa mật khẩu
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
        res.redirect("back")
    } else {
        const record = new Account(req.body);
        await record.save();
        req.flash("success", `Tạo tài khoản thành công`)
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id
    const find = {
        _id: id,
        deleted: false
    }
    try {

        const data = await Account.findOne(find)

        const roles = await Role.find({
            deleted: false
        })

        res.render("admin/pages/account/edit", {
            pageTitle: "Sửa tài khoản",
            data: data,
            roles: roles
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

//[PATCH] /admin/accounts/create
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    const emailExist = await Account.findOne({
        _id: { $ne: id},
        email: req.body.email,
        deleted: false
    })

    if(emailExist){
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
    }
    else{
        if(req.body.password){
            req.body.password = md5(req.body.password)
        }else{
            delete req.body.password
        }
        await Account.updateOne({ _id: id}, req.body)
        req.flash("success", "Chỉnh sửa thành công")
    }
    res.redirect("back")
}
