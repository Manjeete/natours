const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
const compression = require('compression');

const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

//serving static files
app.use(express.static(path.join(__dirname,'public')));

// global middleware

//Set security HTTP headers
app.use(helmet());

// Development logging
// if(process.env.NODE_ENV==='development'){
app.use(morgan('dev'));
// }

// Limit requests from same API
const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many requests from this IP, please try again in an hour!'
});

app.use('/api',limiter);

// body parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}));

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

//Data sanitization against XSS
// app.use(xss());

//Prevent data polution
app.use(hpp({
    whitelist:[
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

// app.use((req,res,next) =>{
//     console.log('Hello from the Middleware 👏');
//     next();
// });

app.use(compression());

//test middlerware
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
});

// Routes Middlewares
app.get('/',(req,res) =>{
    res.status(200).render('base');
})

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users/',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);


// to handled unregister endpoint
app.all('*',(req,res,next) =>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);

module.exports = app;