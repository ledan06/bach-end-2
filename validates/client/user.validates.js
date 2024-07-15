module.exports.registerPost = (req, res, next) =>{
    if(!req.body.fullName){
        req.flash("error", `Vui lòng nhập Họ tên`);
        res.redirect("back");
        return;
    }

    if(!req.body.email){
        req.flash("error", `Vui lòng nhập Email`);
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash("error", `Vui lòng nhập Mật khẩu`);
        res.redirect("back");
        return;
    }

    next(); //miderware
}


module.exports.loginPost = (req, res, next) =>{

    if(!req.body.email){
        req.flash("error", `Vui lòng nhập Email`);
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash("error", `Vui lòng nhập Mật khẩu`);
        res.redirect("back");
        return;
    }

    next(); //miderware
}

module.exports.forgotPassword = (req, res, next) =>{

    if(!req.body.email){
        req.flash("error", `Vui lòng nhập Email`);
        res.redirect("back");
        return;
    }

    next(); //miderware
}

module.exports.resetPasswordPost = (req, res, next) =>{

    if(!req.body.password){
        req.flash("error", `Vui lòng nhập mật khẩu`);
        res.redirect("back");
        return;
    }

    if(!req.body.confirmPassword){
        req.flash("error", `Vui lòng xác nhận mật khẩu`);
        res.redirect("back");
        return;
    }

    if(req.body.password != req.body.confirmPassword){
        req.flash("error", `Mật khẩu không khớp`);
        res.redirect("back");
        return;
    }
    next(); //miderware
}