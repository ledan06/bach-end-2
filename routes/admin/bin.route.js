const express = require('express')
const router = express.Router()
const controller = require("../../controllers/admin/bin.controller")

router.get('/', controller.index)
router.get('/product-category', controller.binCategory)

router.patch('/product-category/restore/:id', controller.restoreCategory)
router.delete('/product-category/delete/:id', controller.deleteCategory)

router.get('/product', controller.binProduct)
router.patch('/product/restore/:id', controller.restoreProduct)
router.delete('/product/delete/:id', controller.deleteCategory)

module.exports = router;