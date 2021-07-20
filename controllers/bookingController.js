const Stripe = require('stripe');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const stripe =  Stripe(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession =catchAsync(async (req,res,next) =>{
    // 1) Get the current book tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description:tour.summary,
                images:['https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270'],
                amount:tour.price*100,
                currency:'usd',
                quantity:1
            }
        ]
    });

    // 3) create session as response
    res.status(200).json({
        status:'success',
        session
    });
});