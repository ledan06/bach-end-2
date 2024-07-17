const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/order.controller")

router.get('/', controller.index)
router.get('/detail/:orderId', controller.detail)
router.patch('/change-status/:status/:orderId', controller.changeStatusPatch)

module.exports = router;