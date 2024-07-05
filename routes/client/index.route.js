const categoryMiddleware = require("../../middlewares/client/category.middleware")


const productRouter = require("./product.route")
const homeRouter = require("./home.route")

module.exports = (app) =>{
    app.use(categoryMiddleware.category)

    app.use('/', homeRouter)
    app.use('/products', productRouter)

}