const systemConfig = require("../../config/system")

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./products.route");
const productCategoryRoutes = require("./products-category.route")
const roleRoutes = require("./role.route")
const accountRoutes = require("./account.route")
const authRoutes = require("./auth.route")
const binsRoutes = require("./bin.route")
const myAccountRoutes = require("./my-account.route");
const blogRoutes = require("./blog.route");
const oderRoutes = require("./order.route");
const settingRoutes = require("./setting.route");


const authMiddleware = require("../../middlewares/admin/auth.middlewares")

module.exports = (app)=>{
    const PATH_ADMIN = systemConfig.prefixAdmin
    app.use(PATH_ADMIN + "/dashboard",authMiddleware.requireAuth, dashboardRoutes);
    app.use(PATH_ADMIN + "/products",authMiddleware.requireAuth, productRoutes);
    app.use(PATH_ADMIN + "/products-category",authMiddleware.requireAuth, productCategoryRoutes);
    app.use(PATH_ADMIN + "/roles",authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN + "/accounts",authMiddleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN + "/my-account",authMiddleware.requireAuth, myAccountRoutes);

    app.use(PATH_ADMIN + "/bins",authMiddleware.requireAuth, binsRoutes);
    app.use(PATH_ADMIN + "/blog",authMiddleware.requireAuth, blogRoutes);

    app.use(PATH_ADMIN + "/orders",authMiddleware.requireAuth, oderRoutes);
    app.use(PATH_ADMIN + "/settings",authMiddleware.requireAuth, settingRoutes);



    app.use(PATH_ADMIN + "/auth", authRoutes);
}