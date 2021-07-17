const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path:'./config.env'});

//db
mongoose.connect(process.env.DATABASE_CLOUD,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology: true })
.then(() => console.log('DB Connected...'))


const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`App running on port ${port}...`);
});
