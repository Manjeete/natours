const mongoose = require('mongoose');
const slugify = require('slugify');

const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have name'],
        unique:true,
        trim:true,
        maxlength:[40,'A tour name must have less or equal then 40 characters'],
        minlength:[10,'A tour name must have more or equal then 10 characters']
    },
    slug:String,
    duration:{
        type:Number,
        required:[true,'A tour must have duration...']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have difficulty type'],
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty is either: easy,medium or difficult.'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0'],
        set:val =>Math.round(val*10)/10
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'A tour must have price']
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true,'A tour must have summary']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'A tour must have a image cover']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    secretTour:{
        type:Boolean
    },
    startDates:[Date],
    startLocation:{
        //GeoJSON
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//tourSchema.index({price:1});
tourSchema.index({price:1, ratingsAverage: -1});
tourSchema.index({slug:1});
tourSchema.index({startLocation:"2d"});


tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
});

tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})

//Document middleware :runs before .save() and .create() (not runs in case of .insertMany)
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true}); 
    next(); 
});


// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// });

//Query Middleware
tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    this.start = Date.now();
    next();
});

// tourSchema.post(/^find/,function(docs,next){
//     console.log(`Query took ${Date.now()-this.start} miliseconds!`)
//     next();
// })

tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v,-passwordChangedAt'
    });
    next();
});

//Aggregation Middleware
// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
//     console.log(this);
//     next();
// });

const Tour = mongoose.model('Tour',tourSchema);

module.exports=Tour;