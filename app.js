const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

const app = express();

// middleware
app.use(morgan('dev'));

app.use(express.json());

app.use((req,res,next) =>{
    console.log('Hello from the Middleware 👏');
    next();
});

app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
});

// Routes Middlewares

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users/',userRouter);

// to handled unregister endpoint
app.all('*',(req,res,next) =>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);

module.exports = app;