const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/products-category.controller")
const validate = require("../../validates/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id',controller.deleteItems)

router.get('/create', controller.create);
router.post('/create', 
    upload.single('thumbnail'), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

module.exports = router;