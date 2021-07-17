const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');

dotenv.config({path:'./config.env'});

//db
mongoose.connect(process.env.DATABASE_CLOUD,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology: true })
.then(() => console.log('DB Connected...'))

const tours = JSON.parse(fs.readFileSync(__dirname+'/tours.json','utf-8'));

// Import data into db
const importData = async () =>{
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded!')
        
    }catch(err){
        console.log(err)
    };
    process.exit()
};

//Delete data from collections

const deleteData = async () =>{
    try{
        await Tour.deleteMany()
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