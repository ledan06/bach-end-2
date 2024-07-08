const Blog = require("../../models/blog.model")
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system")
//[GET]/
module.exports.index = async (req, res) => {
    
    const blogs = await Blog.find({deleted: false})


    for (const blog of blogs) {
        const user = await Account.findOne({_id: blog.createdBy.account_id})

        if(user){
            blog.accountFullName = user.fullName
        }
    }
    res.render("admin/pages/blog/index",{
        pageTitle: "Trang bài viết",
        records: blogs
    })
    
}

//[GET]/blog/creat
module.exports.create = (req, res) => {
    res.render("admin/pages/blog/create",{
        pageTitle: "Trang tạo bài viết"
    })
}

//[POST]/blog/creat
module.exports.createPost = async (req, res) => {

    if(req.body.position == ""){
        const countBlog = await Blog.countDocuments()
        req.body.position = countBlog + 1
    }
    else {
        req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const blog = new Blog(req.body);
    await blog.save();

    res.redirect(`${systemConfig.prefixAdmin}/blog`)
}

//[GET]/blog/edit/:id
module.exports.edit = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const blog = await Blog.findOne(find)
    res.render("admin/pages/blog/edit",{
        pageTitle: "Chỉnh sửa bài viết",
        data: blog
    })
}

//[PATCH]/blog/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        req.body.position = parseInt(req.body.position)
        await Blog.updateOne({_id: req.params.id}, req.body)

        req.flash("success", "Chỉnh sửa thành công")
        res.redirect("back")
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/blog`)
    }
    
}

//[GET]/blog/detail
module.exports.detail = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const blog = await Blog.findOne(find)
    res.render("admin/pages/blog/detail",{
        pageTitle: "Thông tin bài viết",
        records: blog
    })
}

 //[DELETE] /admin/blog/delete/id
 module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Blog.updateOne({ _id: id }, {
        deleted: true,
        deletedBy:{
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    req.flash("success", "Đã xóa thành công!")
    res.redirect("back");

}