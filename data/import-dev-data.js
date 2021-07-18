const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

dotenv.config({path:'./config.env'});

//db
mongoose.connect(process.env.DATABASE_CLOUD,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology: true })
.then(() => console.log('DB Connected...'))

const tours = JSON.parse(fs.readFileSync(__dirname+'/tours.json','utf-8'));
const users = JSON.parse(fs.readFileSync(__dirname+'/user.json','utf-8'));
const reviews = JSON.parse(fs.readFileSync(__dirname+'/reviews.json','utf-8'));


// Import data into db
const importData = async () =>{
    try{
        await Tour.create(tours,{validateBeforeSave:false});
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews,{validateBeforeSave:false});

        console.log('Data successfully loaded!')
        
    }catch(err){
        console.log(err)
    };
    process.exit()
};

//Delete data from collections

const deleteData = async () =>{
    try{
        await User.deleteMany();
        await Tour.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!')
        ;

    }catch(err){
        console.log(err)
    }
    process.exit()

}

if(process.argv[2] ==='--import'){
    importData()
} else if(process.argv[2] ==='--delete'){
    deleteData()
}

console.log(process.argv);