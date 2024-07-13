const User = require("../../models/user.model")
const md5 = require("md5")
const ForgotPassword = require("../../models/forgot-password.model")
const generateHelper = require("../../helpers/generate")
// [GET] user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register",{
        pageTitle: "Đăng ký",
    })
}

// [POST] user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    })
    if(existEmail){
        req.flash("error", "Email đã tồn tại")
        res.redirect("back")
        return;
    }
    req.body.password = md5(req.body.password)

    const user = new User(req.body)
    user.save()

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login",{
        pageTitle: "Đăng nhập",
    })
}

// [POST] user/login
module.exports.loginPost = async (req, res) => {
    const password = req.body.password
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        req.flash("error", "Email không chính xác")
        res.redirect("back")
        return;
    }
    if(md5(password) !== user.password){
        req.flash("error", "Sai mật khẩu")
        res.redirect("back")
        return;
    }
    if(user.status === "inactive"){
        req.flash("error", "Tài khoản đang bị khóa!")
        res.redirect("back")
        return;
    }

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

//[GET] / user/logout
module.exports.logout = async (req, res) => {
    //Xóa tokenUser khỏi cookie
    res.clearCookie("tokenUser")
    res.redirect("back")
}

//[GET] / user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password",{
        pageTitle: "Quên mật khẩu",
    })
}

//[POST] / user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        req.flash("error", "Email không tồn tại")
        res.redirect("back")
        return
    }

    //Lưu thông tin vào DB
    const otp = generateHelper.generateRandomNumber(8);
    const objectForgotPassword ={
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save()
    res.send("OK")
}