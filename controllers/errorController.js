const AppError = require('../utils/appError');

const handleCastErrorDB = err =>{
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message,400);
};

const handleDuplicateFieldsDB = err =>{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value! `;
  return new AppError(message,400)
}

const handleValidationErrorDB = err =>{
  const errors = Object.values(err.errors).map(el =>el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message,400); 
}

const handleJWTError = err =>new AppError('Invalid token. Please log in again!',401);
const handleJWTExpiredError = err =>new AppError('Your token has expired! Please login again.');

const sendErrorDev = (err,res) =>{
  res.status(err.statusCode).json({
    status:err.status,
    error:err,
    message:err.message,
    stack:err.stack

  });
}

const sendErrorProd = (err,res) =>{
  // Operational, trusted error: send message to client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    });

  //Programming or other unknown error: don't leak error details
  }else {
    // 1) Log error
    console.log('ERROR ',err);

    // 2) Send generic message
    res.status(500).json({
      status:'error',
      message:'Something went very worng!'
    });
  }
  
};

module.exports = (err,req,res,next) =>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV ==='development'){
    console.log(err.name);
    sendErrorDev(err,res);
    
  }else if(process.env.NODE_ENV ==='production'){
    // console.log("he",err.name)
    // const error = { ...err };
    if(err.name ==='CastError') err = handleCastErrorDB(err);
    if(err.code ===11000) err = handleDuplicateFieldsDB(err);
    if(err.name ==='ValidationError') err = handleValidationErrorDB(err);
    if(err.name==='JsonWebTokenError') err = handleJWTError(err);
    if(err.name==='TokenExpiredError') err = handleJWTExpiredError(err);

    sendErrorProd(err,res); 
    
  }
};