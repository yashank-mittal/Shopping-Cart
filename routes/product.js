const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const {isLoggedIn} = require('../middleware/middelware')


//home page
router.get('/',(req,res) => {
    res.render('products/home')
})

//Display all the Products
router.get('/products', async(req,res) => {
    try{
        const products = await Product.find({});
        res.render('products/index',{products})
    } catch(e){
        console.log("Something Went Wrong");
        req.flash('error','Cannot find Products');
        res.render('error');
    }
})

//Get the form for new product
router.get('/products/new',isLoggedIn,(req,res) => {
    res.render('products/new')
})

//create new Product
router.post('/products',isLoggedIn,async(req,res) => {
    try{
        await Product.create(req.body.product);
        req.flash('success','Product Created Successfully');
        res.redirect('/products');
    } catch(e) {
        console.log(e.message);
        req.flash('error','Cannot Create Products,Something is Wrong');
        res.render('error');
    }
});

//show perticular product
router.get('/products/:id',async(req,res) => {
      try{
            const product=await Product.findById(req.params.id).populate('reviews');
            res.render('products/show',{product});
      } catch(e) {
          console.log(e.message);
          req.flash('error','Cannot Find this Product');
          res.redirect('/error');
      }
})

//Get Edit Form
router.get('/products/:id/edit',isLoggedIn,async(req,res) => {
     try{
        const product = await Product.findById(req.params.id);
        res.render('products/edit',{product});
     } catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot Edit this Product');
        res.redirect('/error');
     }
})

//Update Products
router.patch('/products/:id',isLoggedIn,async(req,res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body.product);
        req.flash('success', 'Updated Successfully!');
        res.redirect(`/products/${req.params.id}`) 
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot update this Product');
        res.redirect('/error');
    }
})

//Delete product
router.delete('/products/:id',isLoggedIn,async(req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success', 'Deleted the product successfully');
        res.redirect('/products');
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot delete this Product');
        res.redirect('/error');
    }
})

//Creating a New Review on  a Product

router.post('/products/:id/review',isLoggedIn, async (req,res) =>  {
    try {
        const product = await Product.findById(req.params.id);

        const review = new Review({
            user: req.user.username,
            ...req.body
        });
        
        product.reviews.push(review);

        await review.save();
        await product.save();

        req.flash('success','Successfully added your review!')
        res.redirect(`/products/${req.params.id}`);
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot add review to this Product');
        res.redirect('/error');
    }

})

router.delete('/products/:id/reviews/:rid',isLoggedIn,async(req,res) => {
    try{
        await Product.findOneAndUpdate({_id:req.params.id},{$pull:{reviews:req.params.rid}});
        await Review.findByIdAndDelete(req.params.rid);
        req.flash('success',`${req.user.username}'s review deleted successfully`)
        res.redirect(`/products/${req.params.id}`);
    }
    catch(e) {
        req.flash('error','Something Wrong')
        res.render('error')
    }
})


router.get('/error',(req,res) => {
    res.status(404).render('error');
})





module.exports = router;