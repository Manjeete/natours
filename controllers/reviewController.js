const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req,res,next) =>{
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId};
    const reviews = await Review.find(filter);
    res.status(200).json({
        status:'success',
        results:reviews.length,
        data:{
            reviews
        }
    });
});

exports.getReview = catchAsync(async (req,res,next) =>{
    const review = await Review.findById(req.params.id);
    if(!review){
        return next(new AppError('No review found with that id'));
    }

    res.status(200).json({
        status:'success',
        data:{
            review
        }
    })
});

exports.createReview = catchAsync(async (req,res,next) =>{
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);
    res.status(200).json({
        status:'success',
        data:{
            review:newReview
        }
    });
});