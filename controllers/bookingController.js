const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Booking = require('../models/bookingModel');



exports.getCheckoutSession =catchAsync(async (req,res,next) =>{
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // 1) Get the current book tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`https://en.wikipedia.org/wiki/URL`,
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


exports.createBookingCheckout = catchAsync(async (req,res,next) =>{
    const {tour,user,price} = req.query;
    if(!tour && !user && !price) return next();
    await Booking.create({tour,user,price});
    
    res.redirect(req.originalUrl.split('?')[0]);
});


exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
