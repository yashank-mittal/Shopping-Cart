const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/middelware');
const User = require('../models/user');
const Product = require('../models/product');

router.get('/user/:id/me',isLoggedIn,async(req,res) => {
    try {
        const userInfo = await User.findById(req.params.id).populate({
            path: 'orders',
            populate: {
                path: 'orderedProducts',
                model: 'Product'
            }
        })
        res.render('user/myorders',{orders:userInfo.orders});
    }
    catch (e) {
        console.log(e.message);
        req.flash('error','Cannot place the order at this moment, so Please try again later!!!');
        res.render('error');
    }
})

module.exports = router;