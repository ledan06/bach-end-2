const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")
const authMiddleware = require("../../middlewares/client/auth.middlewares")

const productRouter = require("./product.route")
const homeRouter = require("./home.route")
const searchRouter = require("./search.route")
const cartRouter = require("./cart.route")
const checkoutRouter = require("./checkout")
const userRouter = require("./user.route")
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");
const roomsChatRoutes = require("./rooms-chat.route");

module.exports = (app) =>{
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)
    app.use(settingMiddleware.settingGeneral)

    app.use('/', homeRouter)
    app.use('/products', productRouter)

    app.use('/search', searchRouter)

    app.use('/cart', cartRouter)

    app.use('/checkout', checkoutRouter)

    app.use('/user', userRouter)

    app.use("/chat",authMiddleware.requireAuth, chatRoutes);

    app.use("/users",authMiddleware.requireAuth, usersRoutes);

    app.use("/rooms-chat",authMiddleware.requireAuth, roomsChatRoutes);


}